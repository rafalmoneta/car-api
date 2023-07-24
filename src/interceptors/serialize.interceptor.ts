import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// Wrapping the SerializeInterceptor in a decorator.
export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// This interceptor will be used to transform the response object to the DTO class.
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler.
    // console.log('I am running before the handler', context);

    // next.handle() is an Observable that represents the response stream from the route handler.
    // We can use the map operator to transform the response object.
    return next.handle().pipe(
      map((data: any) => {
        // Data Argument is the data that we are going to send back in the outgoing response.
        // Run something before the response is sent out.
        // console.log('I am running before response is sent out', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
