import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Next,
  Query,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { NextFunction, Response } from 'express';
import response from 'src/shared/response';
import { CONSTANT } from 'src/shared/constants/message';
import { ILike } from 'typeorm';
import parseSearchKeyword from 'src/shared/helpers/parse-search-keyword';
import { DeleteDto } from 'src/shared/dto/delete.dto';
import restructureObject from 'src/shared/helpers/restructure-object';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(
    @Body() createCountryDto: CreateCountryDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    // country already exist
    const already = await this.countryService.findOneWhere({
      where: [
        {
          country_code: ILike(`${createCountryDto.country_code}`),
        },
        {
          name: ILike(`${createCountryDto.name}`),
        },
      ],
    });
    if (already) {
      return response.badRequest(
        {
          message: CONSTANT.ERROR.ALREADY_EXISTS('Country'),
          data: already,
        },
        res,
      );
    }
    const result = this.countryService.create(createCountryDto);
    const data = {
      message: CONSTANT.SUCCESS.RECORD_CREATED('Country'),
      data: result,
    };
    response.successCreate(data, res);
    next();
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Query('limit') limit: string = process.env.LIMIT,
    @Query('offset') offset: string = process.env.OFFSET,
    @Query('search') search: string,
    @Query('order')
    order: { [key: string]: 'ASC' | 'DESC' } = { created_at: 'ASC' },
  ) {
    try {
      const [list, count]: any = await this.countryService.findAll({
        where: {
          name: search ? ILike(`%${parseSearchKeyword(search)}%`) : search,
        },
        order: restructureObject(order),
        take: +limit,
        skip: +offset,
      });
      const data = {
        message: count
          ? CONSTANT.SUCCESS.RECORD_FOUND('Country')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Country'),
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

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.countryService.findOne(id);
      const data = {
        message: result
          ? CONSTANT.SUCCESS.RECORD_FOUND('Country')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Country'),
        data: result ? result : {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.countryService.update(id, updateCountryDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('Country')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Country'),
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
      const result = await this.countryService.remove(id, deleteDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_DELETED('Country')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Country'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
