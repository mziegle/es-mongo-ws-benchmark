﻿# es-mongo-ws-benchmark

## Quick Start

Install dependencies.

```bash
npm i
```

Start EventStore and Mongodb.

```bash
docker-compose up
```

Starting the server.

```bash
# every event is validated with class transformer/validator
MODE=classTransformer node server.js
# every event is validated with the mongoose schema
MODE=mongooseSchema node server.js
# no validation
MODE=mongodb node server.js
```

Running the benchmark.

```bash
node benchmark.js --events 10000 --chunkSize 1000 --stream Stream
```
