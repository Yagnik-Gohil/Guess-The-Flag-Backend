import validate from './index';
import * as fs from 'fs';
import { CONSTANT } from '../../shared/constants/message';
import { NextFunction, Request, Response } from 'express';
import response from '../../shared/response';

const validationMiddleware = (schema: any) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const isValid: any = validate(req.body, schema);
      if (isValid.error) {
        if (req?.file && fs.existsSync(req.file.path)) {
          fs.rmSync(req.file.path);
        }
        return response.validationError(
          { message: CONSTANT.ERROR.VALIDATION, data: isValid.error },
          res,
        );
      } else {
        next();
      }
    } catch (error) {
      return response.failureResponse(error, res);
    }
  };
};

export default validationMiddleware;
