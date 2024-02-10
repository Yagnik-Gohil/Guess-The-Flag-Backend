import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Next,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NextFunction, Response } from 'express';
import { CONSTANT } from '../shared/constants/message';
import parseSearchKeyword from 'src/shared/helpers/parse-search-keyword';
import response from '../shared/response';
import { ILike } from 'typeorm';
import { EmailService } from 'src/shared/helpers/send-mail';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private emailService: EmailService,
  ) {}

  @Get()
  async findAll(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Query('limit') limit: string = process.env.LIMIT,
    @Query('offset') offset: string = process.env.OFFSET,
    @Query('search') search: string,
  ) {
    try {
      const [list, count]: any = await this.userService.findAll({
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
        where: {
          name: search ? ILike(`%${parseSearchKeyword(search)}%`) : search,
        },
        take: +limit,
        skip: +offset,
      });
      const data = {
        message: count
          ? CONSTANT.SUCCESS.RECORD_FOUND('User')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('User'),
        total: count,
        limit: +limit,
        offset: +offset,
        data: list,
      };
      response.successResponseWithPagination(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Get('/profile')
  async findOne(
    @Req() req: any,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const id = req.user.id;
      const user = await this.userService.findOne(id);
      const data = {
        message: CONSTANT.SUCCESS.RECORD_FOUND('Profile'),
        data: user,
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Get('/profile/:id')
  async userDetails(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.findOne(id);
      const data = {
        message: result
          ? CONSTANT.SUCCESS.RECORD_FOUND('User')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('User'),
        data: result ? result : {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Patch('/edit')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const id = req.user.id;
      const user = await this.userService.update(id, updateUserDto);
      const data = {
        message: user.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('Profile')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Profile'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Patch('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      const data = {
        message: user.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('User')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('User'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() deleteDto: DeleteDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.remove(id, deleteDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_DELETED('User')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('User'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
