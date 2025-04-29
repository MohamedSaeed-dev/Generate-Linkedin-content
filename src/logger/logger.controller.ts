import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { LoggerService } from './logger.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('logs')
@Public()
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) { }

    @Get()
    findAll(@Query() query: PaginationDto) {
        return this.loggerService.findAll(query);
    }
}
