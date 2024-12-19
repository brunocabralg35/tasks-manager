import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TasksController {
  async create(req: Request, res: Response) {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.id);

    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const createTaskBodySchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]),
      priority: z.enum(["high", "medium", "low"]),
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

    const task = await prisma.task.create({
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
}

export { TasksController };
