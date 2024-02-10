import validate from './index';
import { CONSTANT } from '../../shared/constants/message';
import { NextFunction, Request, Response } from 'express';
import response from '../../shared/response';

const queryValidationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isValid: any = validate(req.query, schema);
    if (isValid.error) {
      return response.validationError(
        { message: CONSTANT.ERROR.VALIDATION, data: isValid.error },
        res,
      );
    } else {
      next();
    }
  };
};

export default queryValidationMiddleware;
