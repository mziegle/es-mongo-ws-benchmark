const mongoose = require("mongoose");
const { Schema } = mongoose;

const timeInfoSchema = new Schema({
    scheduled: {
        type: Date,
        required: true,
    },
    expected: Schema.Types.Mixed,
});

const intermediateStopSchema = new Schema({
    via: {
        type: String,
        required: true,
    },
});

const eventSchema = new Schema({
    canceled: {
        type: Boolean,
        required: true,
    },
    time: {
        type: timeInfoSchema,
        required: true,
    },
    intermediateStops: [intermediateStopSchema],
});

const locationInfoSchema = new Schema({
    scheduled: {
        type: Schema.Types.Mixed,
        required: true,
    },
    expected: {
        type: Schema.Types.Mixed,
    },
});

const schema = new Schema({
    journeyName: {
        type: String,
        required: true,
    },
    journeyId: {
        type: String,
        required: true,
    },
    visitId: {
        type: String,
        required: true,
    },
    line: String,
    operator: String,
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    location: {
        type: locationInfoSchema,
        required: true,
    },
    arrival: {
        type: eventSchema,
        // `default` is required to avoid that the nested default values are set if the object is missing
        default: undefined,
    },
    departure: {
        type: eventSchema,
        // `default` is required to avoid that the nested default values are set if the object is missing
        default: undefined,
    },
    departed: {
        type: Boolean,
        default: false,
    },
    intervention: {
        type: String,
        default: 'NONE',
    },
    lastRelevantTime: {
        type: Date,
        required: true,
        index: true,
    },
});

const Call = mongoose.model("call", schema);

exports.Call = Call;