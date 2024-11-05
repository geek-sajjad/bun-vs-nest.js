import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class HelloWorldController implements OnModuleInit {
  constructor(@Inject('HELLO_WORLD') private client: ClientGrpc) {}

  private helloService;
  onModuleInit() {
    this.helloService = this.client.getService('HelloWorld');
  }

  @Get('hello/:name')
  async sayHello(@Param('name') name: string) {
    const result = await lastValueFrom(this.helloService.SayHello({ name }));
    return result;
  }
}
