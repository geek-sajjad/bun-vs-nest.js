import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";

// import type { ProtoGrpcType } from "./protos/types/helloworld";

const PROTO_PATH = path.resolve(__dirname, "protos/helloworld.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloWorldProtoPackageDef = loadPackageDefinition(packageDefinition);
const helloWorldProto = helloWorldProtoPackageDef.helloworld;

const server = new Server();

// TODO: define type for helloWorldProto
server.addService((helloWorldProto as any).HelloWorld.service, {
  SayHello: sayHello,
});

server.bindAsync("0.0.0.0:50052", ServerCredentials.createInsecure(), () => {
  console.log("Server running at http://0.0.0.0:50052");
});

function sayHello(call: any, callback: any) {
  const replyMessage = `Hello, ${call.request.name}!`;
  callback(null, { message: replyMessage });
}
