import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { FindManyOptions, FindOneOptions, IsNull, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const result = await this.countryRepository.save(createCountryDto);
    return plainToClass(Country, result);
  }

  async findAll(where: FindManyOptions<Country>) {
    const [list, count] = await this.countryRepository.findAndCount(where);
    return [plainToInstance(Country, list), count];
  }

  async findOne(id: string) {
    const user = await this.countryRepository.findOne({
      where: { id },
    });
    return plainToClass(Country, user);
  }

  async findOneWhere(where: FindOneOptions<Country>) {
    const result = await this.countryRepository.findOne(where);
    return plainToClass(Country, result);
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    const result = await this.countryRepository.update(id, updateCountryDto);
    return result;
  }

  async remove(id: string, deleteDto: DeleteDto) {
    const record = await this.countryRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at_ip: deleteDto.deleted_at_ip,
        deleted_at: new Date().toISOString(),
      },
    );
    return record;
  }
}
