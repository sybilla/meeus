import { Angle, AngleStyle } from '../angle';
import { UtcDate } from '../datetime/utcdate';
import { Twilight } from '../engine/meeusEngine';
export declare class GeographicCoordinates {
    private _lat;
    private _lon;
    private _alt;
    private static RegexPatternStyleMap;
    constructor(latitude: Angle, longitude: Angle, altitude: number);
    latitude: Angle;
    longitude: Angle;
    altitude: number;
    sunrise(date: UtcDate | Date, twilight: Twilight): UtcDate;
    sunset(date: UtcDate | Date, twilight: Twilight): UtcDate;
    toFormattedString(config: any): string;
    static parse(s: string, latStyle?: AngleStyle, lonStyle?: AngleStyle): GeographicCoordinates;
}
