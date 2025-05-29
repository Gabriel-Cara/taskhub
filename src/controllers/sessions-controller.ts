import { Request, Response } from "express";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().trim().min(8, "password must be at least 8 characters long"),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if(!user) {
      throw new AppError("invalid email or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw new AppError("invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn
    })

    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({ userWithoutPassword, token });
  }
}

export { SessionsController };