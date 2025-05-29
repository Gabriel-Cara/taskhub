import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8, "password must be at least 8 characters long"),
    });

    const { name, email, password } = bodySchema.parse(request.body); 

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if(userWithSameEmail) {
      throw new AppError("user with same email already exists", 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany();

    return response.json(users);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.user.update({ where: { id }, data: { role: "admin" } });
    
    return response.json(user);
  }
}

export { UsersController };