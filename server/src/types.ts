import { Request, Response } from "express"
import { Redis } from "ioredis";

export type ResolverContext = {
    req: Request;
    res: Response;
    redis: Redis
}