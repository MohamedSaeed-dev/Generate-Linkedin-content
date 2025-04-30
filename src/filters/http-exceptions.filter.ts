import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : null;

        const message =
            typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse?.['message'] || exception.message;

        const stack = exception.stack || new Error().stack;

        const userId = request['user']?.id || 'anonymous';

        const logPayload = {
            timestamp: new Date().toISOString(),
            statusCode: status,
            path: request.url,
            method: request.method,
            ip: request.ip,
            query: request.query,
            body: request.body,
            user: userId,
            errorMessage: message,
            stackTrace: stack,
        };

        this.logger.error(`HTTP Exception for user ${userId}`, logPayload);

        response.status(status).json({
            message,
            errors: process.env.NODE_ENV === 'PROD' ? undefined : stack,
        });
    }
}
