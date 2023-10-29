"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.transformAndValidate = void 0;
require("reflect-metadata");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var TimeInfo = /** @class */ (function () {
    function TimeInfo() {
    }
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_transformer_1.Type)(function () { return Date; })
    ], TimeInfo.prototype, "scheduled");
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return Date; })
    ], TimeInfo.prototype, "expected");
    return TimeInfo;
}());
var IntermediateStop = /** @class */ (function () {
    function IntermediateStop() {
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], IntermediateStop.prototype, "via");
    return IntermediateStop;
}());
var LocationInfo = /** @class */ (function () {
    function LocationInfo() {
    }
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_transformer_1.Type)(function () { return Object; })
    ], LocationInfo.prototype, "scheduled");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsObject)(),
        (0, class_transformer_1.Type)(function () { return Object; })
    ], LocationInfo.prototype, "expected");
    return LocationInfo;
}());
var Event = /** @class */ (function () {
    function Event() {
    }
    __decorate([
        (0, class_validator_1.IsBoolean)()
    ], Event.prototype, "canceled");
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TimeInfo; })
    ], Event.prototype, "time");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return IntermediateStop; }),
        (0, class_validator_1.IsArray)({ each: true })
    ], Event.prototype, "intermediateStops");
    return Event;
}());
var Call = /** @class */ (function () {
    function Call() {
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "journeyName");
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "journeyId");
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "visitId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], Call.prototype, "line");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], Call.prototype, "operator");
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "origin");
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "destination");
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return LocationInfo; })
    ], Call.prototype, "location");
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return Event; })
    ], Call.prototype, "arrival");
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return Event; })
    ], Call.prototype, "departure");
    __decorate([
        (0, class_validator_1.IsBoolean)()
    ], Call.prototype, "departed");
    __decorate([
        (0, class_validator_1.IsString)()
    ], Call.prototype, "intervention");
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_transformer_1.Type)(function () { return Date; })
    ], Call.prototype, "lastRelevantTime");
    return Call;
}());
function transformAndValidate(object) {
    return __awaiter(this, void 0, void 0, function () {
        var transformationResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transformationResult = (0, class_transformer_1.plainToClass)(Call, object);
                    return [4 /*yield*/, (0, class_validator_1.validateOrReject)((0, class_transformer_1.plainToClass)(Call, transformationResult))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.transformAndValidate = transformAndValidate;
;
/*
const raw = {
    callId: 'b866a2ec-256a-4c77-a545-d4a5d8195883',
    journeyId: `101-2003-02-01`,
    journeyName: `101`,
    location: { scheduled: { station: 'B', track: '1' } },
    origin: 'A',
    arrival: {
        time: {
            scheduled: new Date('2001-01-01T10:00:00Z')
        },
        canceled: false,
    },
    departure: {
        time: {
            scheduled: new Date('2001-01-01T10:05:00Z')
        },
        canceled: false,
    },
    destination: 'C',
    visitId: `B-1`,
    departed: false,
    intervention: 'NONE',
    lastRelevantTime: new Date('2001-01-01T10:05:00Z'),
}

transformAndValidate(raw).catch((err) => {
    console.log(err.toString());

    throw err;
})
*/ 
