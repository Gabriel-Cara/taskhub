import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      assigned_to: z.string().uuid(),
      team_id: z.string().uuid(),
    });

    const { title, description, status, priority, assigned_to, team_id } =
      bodySchema.parse(request.body);

    const taskAlreadyExists = await prisma.task.findFirst({ where: { title } });

    if (taskAlreadyExists) {
      throw new AppError("task already exists", 400);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: assigned_to,
        teamId: team_id,
      },
    });

    if (!task) {
      throw new AppError("task not created", 400);
    }

    return response.status(201).json({ message: "ok" });
  }

  async index(request: Request, response: Response) {
    const tasks = await prisma.task.findMany({
      include: {
        teamMember: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                role: true
              },
            },
            team: {
              select: {
                name: true
              }
            }
          },
        },
      },
    });

    return response.json(tasks);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id: id } = paramsSchema.parse(request.params);

    await prisma.task.delete({ where: { id } });

    return response.json({ message: "ok" });
  }

  async updateAdmin(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id: id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      assigned_to: z.string().uuid().optional(),
      team_id: z.string().uuid().optional(),
    });

    const { title, description, status, priority, assigned_to, team_id } = bodySchema.parse(request.body);

    const task = await prisma.task.findUnique({ where: { id } });

    if(!task) {
      throw new AppError("task not found", 404);
    }

    await prisma.task.update({
      where: { id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        status: status ?? task.status,
        priority: priority ?? task.priority,
        assignedTo: assigned_to ?? task.assignedTo,
        teamId: team_id ?? task.teamId,
      },
    });

    return response.json({ message: "task updated successfully" });
  }

  async updateMember(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_member_id: z.string().uuid(),
      task_id: z.string().uuid(),
    })

    const { team_member_id, task_id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    })

    const { title, description, status, priority } = bodySchema.parse(request.body);

    const task = await prisma.task.findUnique({ where: { id: task_id } });

    if(!task) {
      throw new AppError("task not found", 404);
    }

    if(task.assignedTo !== team_member_id) {
      throw new AppError("Unauthorized", 404);
    }

    await prisma.task.update({
      where: { id: task_id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        status: status ?? task.status,
        priority: priority ?? task.priority,
      },
    })

    return response.json({ message: "task updated successfully" });
  }
}

export { TasksController };
