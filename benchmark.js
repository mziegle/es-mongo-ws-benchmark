#!/usr/bin/env node

'use strict';

const {
    EventStoreDBClient,
    jsonEvent,
} = require("@eventstore/db-client");
const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');
const { randomUUID } = require("crypto");
const WebSocket = require('ws');
const delayInMillis = 100;

const parser = new ArgumentParser({
    description: 'Eventstore, Mongodb, WebSocket Benchmark'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-e', '--events', { help: 'number of events to publish', default: 1000 });
parser.add_argument('-c', '--chunkSize', { help: 'chunk size of events to publish', default: 100 });
parser.add_argument('-s', '--stream', { help: 'the stream to publish the events to', default: 'stream' });
parser.add_argument('-l', '--loggingEnabled', { help: 'enable logging', default: false });
parser.add_argument('--eventstore', { help: 'Eventstore connection string', default: 'localhost:2113' });
parser.add_argument('--wss', { help: 'WebSocket server connection string', default: 'localhost:9000' });

const { eventstore, wss, events, chunkSize, stream, loggingEnabled } = parser.parse_args();

console.log(eventstore, wss, events, chunkSize, stream);

let startTime = 0;
let counter = 0;

async function receiveEvents() {
    const webSocket = new WebSocket(`ws://${wss}`);

    webSocket.on('error', console.error);

    webSocket.on('open', function open() {
        console.log('connection openend');
        startTime = Date.now();
        setTimeout(() => sendEvents(), delayInMillis);
    });

    webSocket.on('message', function message(message) {
        ++counter

        if (Boolean(loggingEnabled)) {
            console.log('->', counter, message.toString());
        }
        if (counter === parseInt(events)) {
            console.log(`It took ${Date.now() - startTime}ms to process all ${events} events`);
            setTimeout(() => webSocket.close(), delayInMillis);
        }
    });
}

async function sendEvents() {
    const client = EventStoreDBClient.connectionString(`esdb://${eventstore}?tls=false`);
    let buffer = [];

    for (let index = 0; index < parseInt(events); index++) {
        const event = jsonEvent({
            type: 'CallUpdated',
            data: {
                callId: randomUUID(),
                journeyId: `${index}-2003-02-01`,
                journeyName: `name-${index}`,
                location: { scheduled: { station: 'B', track: '1' } },
                origin: 'A',
                arrival: {
                    time: { scheduled: new Date('2001-01-01T10:00:00Z') },
                    canceled: false,
                },
                departure: {
                    time: { scheduled: new Date('2001-01-01T10:05:00Z') },
                    canceled: false,
                },
                destination: 'C',
                visitId: `B-${index}`,
                departed: false,
                intervention: 'NONE',
                lastRelevantTime: new Date('2001-01-01T10:05:00Z'),
            }
        });

        buffer.push(event);

        if (buffer.length === parseInt(chunkSize)) {
            console.log(`appending ${buffer.length} events`);
            await client.appendToStream(stream, buffer);
            buffer = [];
        }
    }

    await client.dispose();
}

receiveEvents();
