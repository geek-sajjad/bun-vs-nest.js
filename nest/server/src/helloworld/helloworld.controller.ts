import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class HelloWorldController {
  @GrpcMethod('HelloWorld', 'SayHello')
  sayHello(data: any, metadata: Metadata) {
    const replyMessage = `Hello, ${data.name}!`;

    return { message: replyMessage };
  }
}
