import { NextFunction, Request, Response } from 'express';
import { DefaultIpColumn } from 'src/shared/constants/enum';
import getIp from 'src/shared/helpers/get-ip';

const setIpAddress = (columns: DefaultIpColumn[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    columns.forEach((column: string) => {
      Object.assign(req.body, { [column]: getIp(req) });
    });
    next();
  };
};

export default setIpAddress;
