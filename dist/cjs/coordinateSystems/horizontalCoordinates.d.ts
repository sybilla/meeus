import { Angle, AngleStyle } from '../angle';
import { UtcDate } from '../datetime/utcdate';
import { GeographicCoordinates } from './geographicCoordinates';
import { EquatorialCoordinates } from './equatorialCoordinates';
export declare class HorizontalCoordinates {
    private _alt;
    private _az;
    private static RegexPatternStyleMap;
    constructor(altitude: Angle, azimuth: Angle);
    altitude: Angle;
    azimuth: Angle;
    toEquatorialCoordinates(date: UtcDate | Date, location: GeographicCoordinates): EquatorialCoordinates;
    toFormattedString(config: any): string;
    static parse(s: string, altStyle?: AngleStyle, azStyle?: AngleStyle): HorizontalCoordinates;
}
