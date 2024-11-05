import { Hono } from "hono";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";

import { credentials, loadPackageDefinition } from "@grpc/grpc-js";

const app = new Hono();

const PROTO_PATH = path.resolve(__dirname, "protos/helloworld.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}) as any;

const helloWorldProto = loadPackageDefinition(packageDefinition).helloworld;

const client = new (helloWorldProto as any).HelloWorld(
  "localhost:50052",
  credentials.createInsecure()
);

app.get("hello/:name", async (c) => {
  try {
    const res = await new Promise((resolve, reject) => {
      client.sayHello(
        { name: c.req.param("name") },
        (err: any, response: any) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        }
      );
    });

    return c.json(res as any);
  } catch (err: any) {
    return c.text(err, 500);
  }
});

app.notFound((c) => {
  return c.text("not found", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

// export default {
//   port: 3000,
//   fetch: app.fetch,
// }

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Listening on localhost:${server.port}`);
