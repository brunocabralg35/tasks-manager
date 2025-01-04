import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TasksController {
  async index(req: Request, res: Response) {
    const team_id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.team_id);

    const team = await prisma.team.findUnique({
      where: { id: team_id },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const tasks = await prisma.task.findMany({
      where: {
        teamId: team.id,
      },
      include: {
        assignedToUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json(tasks);
  }

  async create(req: Request, res: Response) {
    const team_id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.team_id);

    const team = await prisma.team.findUnique({
      where: { id: team_id },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const createTaskBodySchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      status: z
        .enum(["pending", "in_progress", "completed"])
        .default("pending"),
      priority: z.enum(["high", "medium", "low"]).default("low"),
      assigned_to: z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {
          message: "user_id must be a number",
        }),
    });

    const { title, description, status, priority, assigned_to } =
      createTaskBodySchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: assigned_to },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: assigned_to,
        teamId: team.id,
      },
    });

    return res.status(201).json();
  }

  async update(req: Request, res: Response) {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (
      req.user!.role !== "admin" &&
      Number(req.user!.id) !== task.assignedTo
    ) {
      throw new AppError("You are not allowed to update this task", 403);
    }

    const statusSchema = z.enum(["pending", "in_progress", "completed"]);

    const status = statusSchema.parse(req.body.status);

    if (status === task.status) {
      throw new AppError("Task status is the same", 400);
    }

    await prisma.task.update({
      where: { id },
      data: {
        status,
      },
    });

    await prisma.taskHistory.create({
      data: {
        taskId: id,
        oldStatus: task.status,
        newStatus: status,
        changedBy: Number(req.user!.id),
      },
    });

    return res.status(200).json();
  }

  async delete(req: Request, res: Response) {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        taskId: task.id,
      },
    });

    await prisma.taskHistory.deleteMany({
      where: {
        taskId: task.id,
      },
    });

    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    return res.status(200).json();
  }
}

export { TasksController };
