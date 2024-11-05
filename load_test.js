import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  vus: 10, // Virtual users
  duration: "30s", // Test duration
};

export default function () {
  const res = http.get("http://localhost:3000/hello/world");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1); // Pauses each virtual user for 1 second before the next request
}
