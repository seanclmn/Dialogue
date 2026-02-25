import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const _gqlHost = GqlArgumentsHost.create(host);
    
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      
      if (Array.isArray(response.message)) {
        message = response.message[0];
      } else {
        message = response.message || exception.message;
      }
      
      code = response.error || 'HTTP_EXCEPTION';
    } else if (exception instanceof Error) {
      message = exception.message;
      code = (exception as any).code || 'ERROR';
    }

    // Return a GraphQLError which NestJS will handle correctly
    return new GraphQLError(message, {
      extensions: {
        code,
        status,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
