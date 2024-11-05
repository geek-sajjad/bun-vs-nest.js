const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.resolve(__dirname, "protos/helloworld.proto");

// console.log("PROTO_PATH", PROTO_PATH);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloWorldProto =
  grpc.loadPackageDefinition(packageDefinition).helloworld;

// console.log("helloWorldProto", helloWorldProto);

const server = new grpc.Server();

server.addService(helloWorldProto.HelloWorldService.service, {
  SayHello: sayHello,
});

server.bindAsync(
  "0.0.0.0:50053",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running at http://0.0.0.0:50053");
  }
);

function sayHello(call, callback) {
  const replyMessage = `Hello, ${call.request.name}!`;
  callback(null, { message: replyMessage });
}
