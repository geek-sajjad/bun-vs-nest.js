const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const express = require("express");
const app = express();

// Load the proto file
const PROTO_PATH = path.resolve(__dirname, "protos/helloworld.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const helloWorldProto =
  grpc.loadPackageDefinition(packageDefinition).helloworld;

// Set up the client
const client = new helloWorldProto.HelloWorldService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const PORT = 3000;

app.get("/hello/:name", (req, res) => {
  client.SayHello({ name: req.params.name }, (err, response) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(response);
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: ["GET /hello/:name", "GET /health"],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
