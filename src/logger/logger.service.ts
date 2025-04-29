// logger.service.ts
import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { createLogger, transports, format } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class LoggerService {
  private readonly logFilePath = path.join(__dirname, '..', '..', 'logs', 'error.log'); // Adjust the path

  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
  });

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} - ${trace || ''}`);
  }

  async findAll(query: PaginationDto) {
    const { offset = 0, limit = 10 } = query;

    if (!fs.existsSync(this.logFilePath)) {
      return { data: [], total: 0, offset, limit };
    }

    const fileContent = fs.readFileSync(this.logFilePath, 'utf8');
    const lines = fileContent.trim().split('\n');

    const total = lines.length;
    const paginatedLines = lines.slice(offset, offset + limit);

    // Optionally: Try to parse each line if it's JSON structured
    const data = paginatedLines.map((line) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        return { raw: line };
      }
    });

    return {
      data,
      total,
      offset,
      limit,
    };
  }
}
