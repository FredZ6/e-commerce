# API Performance Baseline

- Generated at (UTC): 2026-02-23T17:56:20Z
- Base URL: `http://localhost:8086`
- Requests per endpoint: `200`
- Concurrency: `10`

| Endpoint | Requests | 2xx | Avg (s) | P95 (s) | P99 (s) | Min (s) | Max (s) | Throughput (req/s) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| /api/products | 200 | 200 | 0.011352 | 0.021242 | 0.028684 | 0.004445 | 0.055814 | 88.09 |
| /actuator/health | 200 | 200 | 0.007026 | 0.013773 | 0.019867 | 0.002173 | 0.020235 | 142.34 |
