import type { Request, Response } from 'express';
import { getHealthStatus } from "./health.service.js"


export const healthCheck = (_req: Request, res: Response) => {
  res.status(200).json(getHealthStatus())
}