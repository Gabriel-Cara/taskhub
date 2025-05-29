import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3, "name must be declared"),
      description: z.string().optional()
    })

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.team.create({ data: { name, description } });

    const teamAlreadyExists = await prisma.team.findFirst({ where: { name } });

    if(teamAlreadyExists) {
      throw new AppError("team with same name already exists", 400);
    }

    return response.status(201).json(team);
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany();
    
    if(teams.length === 0) {
      throw new AppError("teams not found", 404);
    }

    return response.json(teams);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const team = await prisma.team.findUnique({ 
      where: { id }, 
      include: { 
        teamMembers: {
          select: {
            teamId: true,
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      } });

    if(!team) {
      throw new AppError("team not found", 404);
    }

    return response.json(team);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      name: z.string().min(3, "name must be declared"),
      description: z.string().optional()
    })

    const { id } = paramsSchema.parse(request.params);

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.team.update({ where: { id }, data: { name, description: description ?? undefined } });
    
    return response.json(team);
  }
}

export { TeamsController };