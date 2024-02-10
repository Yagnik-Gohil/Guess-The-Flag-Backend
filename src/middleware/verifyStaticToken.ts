import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import response from '../shared/response';

@Injectable()
export class verifyStaticToken implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return response.unAuthenticatedRequest(res);
      }
      const token = authHeader.split(' ')[1];
      const isValid = token === process.env.STATIC_TOKEN;
      if (!isValid) {
        return response.unAuthenticatedRequest(res);
      }
      next();
    } catch (error) {
      return response.unAuthenticatedRequest(res);
    }
  }
}
