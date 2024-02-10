import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { CONSTANT } from './constants/message';

interface Data {
  message: string;
  data: any;
}

interface List {
  message?: string;
  total: number;
  limit: number;
  offset: number;
  data: unknown[];
}

const successCreate = (data: Data, res: Response) => {
  res.status(HttpStatus.CREATED).json({
    status: 1,
    message: data.message ? data.message : CONSTANT.SUCCESS.DEFAULT,
    data: data.data,
  });
};

const successResponse = (data: Data, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: 1,
    message: data.message ? data.message : CONSTANT.SUCCESS.DEFAULT,
    data: data.data,
  });
};

const successResponseWithPagination = (data: List, res: Response) => {
  const message = data.data.length
    ? CONSTANT.SUCCESS.RECORD_FOUND('Record')
    : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Record');
  res.status(HttpStatus.OK).json({
    status: 1,
    message: data.message ? data.message : message,
    total: data.total,
    limit: data.limit,
    offset: data.offset,
    data: data.data,
  });
};

const failureResponse = (error: any, res: Response) => {
  let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  if (
    error.name &&
    [
      'Error',
      'TypeError',
      'TypeORMError',
      'QueryFailedError',
      'EntityPropertyNotFoundError',
    ].includes(error.name)
  ) {
    if (error.code && ['23505'].includes(error.code)) {
      httpStatus = HttpStatus.BAD_REQUEST;
      error.message = CONSTANT.ERROR.ALREADY_EXISTS('Record');
    } else {
      error.message = CONSTANT.ERROR.METHOD_NOT_ALLOWED;
    }
  }
  res.status(httpStatus).json({
    status: 0,
    message: error.message
      ? error.message
      : CONSTANT.ERROR.INTERNAL_SERVER_ERROR,
    data: error.data,
  });
};

const badRequest = (data: Data, res: Response) =>
  res.status(HttpStatus.BAD_REQUEST).json({
    status: 0,
    message: data.message ? data.message : CONSTANT.ERROR.BAD_SYNTAX,
    data: data.data,
  });

const validationError = (data: Data, res: Response) =>
  res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    status: 0,
    message: data.message ? data.message : CONSTANT.ERROR.VALIDATION,
    data: data.data,
  });

const recordNotFound = (data: Data, res: Response) =>
  res.status(HttpStatus.OK).json({
    status: 0,
    message: data.message
      ? data.message
      : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Record'),
    data: data.data,
  });

const unAuthenticatedRequest = (res: Response) =>
  res.status(HttpStatus.UNAUTHORIZED).json({
    status: 0,
    message: CONSTANT.ERROR.UNAUTHENTICATED,
  });

const unAuthorizedRequest = (res: Response) =>
  res.status(HttpStatus.UNAUTHORIZED).json({
    status: 0,
    message: CONSTANT.ERROR.UNAUTHORIZED,
  });

const tooManyRequest = (res) =>
  res.status(HttpStatus.TOO_MANY_REQUESTS).json({
    status: 0,
    message: CONSTANT.ERROR.TOO_MANY_REQUESTS,
  });

const payloadTooLarge = (res: Response, message: string) =>
  res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
    status: 0,
    message: message,
  });

const response = {
  successCreate,
  successResponse,
  successResponseWithPagination,
  failureResponse,
  badRequest,
  validationError,
  recordNotFound,
  unAuthenticatedRequest,
  unAuthorizedRequest,
  tooManyRequest,
  payloadTooLarge,
};
export default response;
