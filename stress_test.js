import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 50 }, // Ramp up to 50 VUs in 1 minute
    { duration: "2m", target: 200 }, // Increase to 200 VUs in 2 minutes
    { duration: "2m", target: 400 }, // Increase to 400 VUs in 2 minutes
    { duration: "2m", target: 600 }, // Increase to 600 VUs in 2 minutes
    { duration: "2m", target: 800 }, // Increase to 800 VUs in 2 minutes
    { duration: "3m", target: 0 }, // Gradual ramp-down
  ],
};

export default function () {
  const res = http.get("http://localhost:3000/hello/world");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 2000ms": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
