import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamsController {
  async create(req: Request, res: Response) {
    const createTeamBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { name, description } = createTeamBodySchema.parse(req.body);

    const alreadyExists = await prisma.team.findFirst({
      where: {
        name,
      },
    });

    if (alreadyExists) {
      throw new AppError("Team already exists", 409);
    }

    await prisma.team.create({
      data: {
        name,
        description,
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

    const updateTeamBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { name, description } = updateTeamBodySchema.parse(req.body);

    const team = await prisma.team.findFirst({
      where: {
        id,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.team.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json();
  }

  async addMember(req: Request, res: Response) {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.id);

    const user_id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.user_id);

    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const team = await prisma.team.findFirst({
      where: {
        id,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: id,
      },
    });

    return res.status(200).json();
  }

  async removeMember(req: Request, res: Response) {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.id);

    const user_id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(req.params.user_id);

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: user_id,
        teamId: id,
      },
    });

    if (!teamMember) {
      throw new AppError("User not found in team", 404);
    }

    await prisma.teamMember.delete({
      where: {
        id: teamMember.id,
      },
    });

    return res.status(200).json();
  }
}

export { TeamsController };
