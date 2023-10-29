import 'reflect-metadata';
import { plainToClass, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
    validateOrReject,
} from 'class-validator';

class TimeInfo {
    @IsDate()
    @Type(() => Date)
    scheduled!: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    expected?: Date;
}

class IntermediateStop {
    @IsString()
    via!: string;
}

class LocationInfo {
    @IsObject()
    @Type(() => Object)
    scheduled!: Object;

    @IsOptional()
    @IsObject()
    @Type(() => Object)
    expected?: Object;
}

class Event {
    @IsBoolean()
    canceled!: boolean;

    @IsObject()
    @ValidateNested()
    @Type(() => TimeInfo)
    time!: TimeInfo

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => IntermediateStop)
    @IsArray({ each: true })
    intermediateStops?: IntermediateStop[];
}

class Call {
    @IsString()
    journeyName!: string;

    @IsString()
    journeyId!: string;

    @IsString()
    visitId!: string;

    @IsOptional()
    @IsString()
    line?: string;

    @IsOptional()
    @IsString()
    operator?: string;

    @IsString()
    origin!: string;

    @IsString()
    destination!: string;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationInfo)
    location!: LocationInfo

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Event)
    arrival?: Event

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Event)
    departure?: Event

    @IsBoolean()
    departed!: boolean;

    @IsString()
    intervention!: string;

    @IsDate()
    @Type(() => Date)
    lastRelevantTime!: Date;
}

export async function transformAndValidate(object: Object) {
    const transformationResult = plainToClass(Call, object);
    await validateOrReject(plainToClass(Call, transformationResult));
};

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