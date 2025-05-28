import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamMembersController {
  async add(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      team_id: z.string().uuid(),
    });

    const { user_id, team_id } = bodySchema.parse(request.body);

    const isUserAlreadyInTeam = await prisma.teamMember.findFirst({
      where: { userId: user_id, teamId: team_id },
    });

    if (isUserAlreadyInTeam) {
      throw new AppError("user already in team", 400);
    }

    const teamMember = await prisma.teamMember.create({
      data: { userId: user_id, teamId: team_id },
    });

    const { id } = teamMember;

    const teamMemberWithRelations = await prisma.teamMember.findUnique({
      where: { id },
      include: { user: true, team: true },
    });

    return response.status(201).json(teamMemberWithRelations);
  }

  async exclude(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const teamMember = await prisma.teamMember.findUnique({ where: { id } });

    if(!teamMember) {
      throw new AppError("team member not found", 404);
    }

    await prisma.teamMember.delete({ where: { id } });
    
    return response.json({ message: "team member deleted" });
  }

  async index(request: Request, response: Response) {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },

        team: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (teamMembers.length === 0) {
      throw new AppError("no team members found", 404);
    }

    return response.json(teamMembers);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = paramsSchema.parse(request.params);

    const teamMember = await prisma.teamMember.findMany({
      where: { userId: user_id },
      include: {
        team: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    const user = await prisma.teamMember.findFirst({
      where: { userId: user_id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!teamMember || !user) {
      throw new AppError("team member not found", 404);
    }

    return response.json({ user, teamMember });
  }
}

export { TeamMembersController };
