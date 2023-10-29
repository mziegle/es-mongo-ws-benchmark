const { EventStoreDBClient, TimeoutError, BACKWARDS, END, START, StreamNotFoundError } = require('@eventstore/db-client');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');
const { Call } = require('./models/mongoose');
const { transformAndValidate } = require('./models/classValidator');

const loggingEnabled = false;
const mode = 'classTransformer';
const wssPort = process.env.WSS_PORT || '9000'
const eventstore = process.env.EVENTSTORE || 'localhost:2113';
const mongodb = process.env.MONGODB || 'localhost:27017';
const stream = process.env.STREAM || 'Stream';

const eventStoreConnectionString = `esdb://${eventstore}?tls=false`;
const mongdbConnectionString = `mongodb://${mongodb}`;
const webSocketServer = new WebSocketServer({ port: wssPort });

let counter = 0;
let currentWebSocketConnection;

console.log(`Starting WebSocket server listening at port ${wssPort}`);

webSocketServer.on('connection', async function connection(incomingConnection) {
    console.log(`Connection accepted`);

    currentWebSocketConnection = incomingConnection;

    incomingConnection.on('error', (err) => {
        console.error(err);
        incomingConnection.close();
        currentWebSocketConnection = undefined;
        counter = 0;
    });

    incomingConnection.on('close', async() => {
        console.log('WebSocket connection closed');
        currentWebSocketConnection = undefined;
        counter = 0;
    });
});

async function start() {
    console.log(`Mode: ${mode}`);

    console.log(`Connecting to MongoDB at ${mongdbConnectionString}`);
    await mongoose.connect(mongdbConnectionString);

    console.log(`Connecting to Eventstore at ${eventStoreConnectionString}`);
    const eventStoreClient = EventStoreDBClient.connectionString(eventStoreConnectionString);

    let checkpoint = START;

    try {
        for await (const resolvedEvent of eventStoreClient.readStream(stream, { direction: BACKWARDS, fromRevision: END })) {
            checkpoint = resolvedEvent.event.revision;
            break;
        }
    } catch (error) {
        if (error instanceof StreamNotFoundError) {
            console.log('stream does not exsist yet, subscribing from start');
        }
    }

    async function readEvents(revision) {
        console.log(`subscribing to ${stream} from ${revision}`);
        const events = eventStoreClient.subscribeToStream(stream, { fromRevision: revision });

        for await (const resolvedEvent of events) {
            checkpoint = resolvedEvent.event.revision;

            if (!currentWebSocketConnection) {
                console.warn(`Received event at ${checkpoint} but had no connection to forward it to`);
                continue;
            }

            const data = resolvedEvent.event.data;
            const rawData = JSON.stringify(data);

            if (mode === 'mongooseSchema') {
                const call = new Call(data);
                await call.save();
            } else if (mode === 'mongodb') {
                await Call.collection.insertOne(data);
            } else if (mode === 'classTransformer') {
                await transformAndValidate(data);
                await Call.collection.insertOne(data);
            } else {
                throw new Error('No mode active');
            }

            currentWebSocketConnection.send(rawData, (err) => {
                if (err) {
                    console.error(err);
                } else if (loggingEnabled) {
                    console.log(`${++counter}-> ${rawData}`)
                }
            });
        }
    }

    let done = false;

    while (!done) {
        try {
            await readEvents(checkpoint);
            done = true;
        } catch (error) {
            if (error instanceof TimeoutError) {
                console.log('@', checkpoint, error.message);
                continue;
            } else {
                console.log(error);
                throw error;
            }
        }
    }
}

start();