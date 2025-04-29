import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { LoggerService } from './logger.service';

@Controller('logs')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) { }

    @Get()
    findAll(@Query() query: PaginationDto) {
        return this.loggerService.findAll(query);
    }
}
