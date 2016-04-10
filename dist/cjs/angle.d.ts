export declare enum AngleStyle {
    Hour = 0,
    Degree = 1,
    Radian = 2,
}
export declare enum AngleNormalization {
    Reflective = 0,
    Periodic = 1,
}
export declare class AngleParser {
    static RegexPatterns: Array<any>;
    static RegexPatternStyleMap: any;
    static parse(s: string, patternStyleMap: any, style?: AngleStyle): Angle;
    static match(s: string, patternStyleMap: any, style?: AngleStyle): any;
    static matchToAngle(match: any): Angle;
}
export declare class Angle {
    static DegreeMillisecondsInDegree: number;
    static DegreeMillisecondsInDegreeMinute: number;
    static DegreeMillisecondsInDegreeSecond: number;
    static DegreeMillisecondsInMillisecond: number;
    private _dms;
    constructor(degrees: any);
    hours: number;
    hour: number;
    hourMinutes: number;
    hourMinute: number;
    hourSeconds: number;
    hourSecond: number;
    hourMilliseconds: number;
    hourMillisecond: number;
    degrees: number;
    degree: number;
    degreeMinutes: number;
    degreeMinute: number;
    degreeSeconds: number;
    degreeSecond: number;
    degreeMilliseconds: number;
    degreeMillisecond: number;
    radians: number;
    addHours(hours: number): Angle;
    addHourMinutes(minutes: number): Angle;
    addHourSeconds(seconds: number): Angle;
    addHourMilliseconds(milliseconds: number): Angle;
    addDegrees(degrees: number): Angle;
    addDegreeMinutes(minutes: number): Angle;
    addDegreeSeconds(seconds: number): Angle;
    addDegreeMilliseconds(milliseconds: number): Angle;
    toFormattedString(config: any): string;
    negative(): Angle;
    normalize(lowerBound?: number, normalization?: AngleNormalization): Angle;
    private __normalizeReflective(lowerBound);
    private __normalizePeriodic(lowerBound);
    private __normalizeInternal(lowerBound);
    static fromDegrees(degrees?: number, degreeMinutes?: number, degreeSeconds?: number, degreeMilliseconds?: number): Angle;
    static fromHours(hours?: number, hourMinutes?: number, hourSeconds?: number, hourMilliseconds?: number): Angle;
    static fromRadians(radians?: number): Angle;
    static parse(s: string, style?: AngleStyle): Angle;
    private static absPad(val, fixed?);
}
