// logger.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
            ],
        }),
    ],
    controllers:[LoggerController],
    providers: [LoggerService],
    exports: [WinstonModule, LoggerService],
})
export class LoggerModule { }
