import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HelloWorldController } from './helloworld.controller';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HELLO_WORLD',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: 'helloworld',
          protoPath: join(__dirname, '../', 'helloworld.proto'),
        },
      },
    ]),
  ],
  controllers: [HelloWorldController],
  providers: [],
})
export class HelloWorldModule {}
