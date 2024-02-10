import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../user-token/entities/user-token.entity';
import { IsNull, Repository } from 'typeorm';
import response from '../shared/response';
// import { decrypt } from 'src/shared/helpers/encrypt-decrypt';

@Injectable()
export class verifyToken implements NestMiddleware {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return response.unAuthenticatedRequest(res);
      }
      // const encryptedTokenWithStamp = decrypt(authHeader.split(' ')[1]);
      // const [token, stamp] = encryptedTokenWithStamp.split('_SPLIT_HERE_');
      // const currentStamp = Math.floor(Date.now() / 1000);
      // if (currentStamp - parseInt(stamp) > 30) {
      //   //! Add condition if difference is not negative
      //   // If request is taking more then 30 second then return as unauthorized
      //   return response.unAuthenticatedRequest(res);
      // }
      const token = authHeader.split(' ')[1];
      const validate: any = await jwt.verify(token, process.env.JWT_SECRET);
      if (validate) {
        const isExist = await this.userTokenRepository.findOne({
          where: {
            [validate['table']]: { id: validate.id },
            token: token,
            deleted_at: IsNull(),
          },
        });

        if (!isExist) {
          return response.unAuthenticatedRequest(res);
        }
        Object.assign(req, {
          user: {
            column: validate['column'],
            id: validate['id'],
            table: validate['table'],
          },
        });
        next();
      }
    } catch (error) {
      return response.unAuthenticatedRequest(res);
    }
  }
}
