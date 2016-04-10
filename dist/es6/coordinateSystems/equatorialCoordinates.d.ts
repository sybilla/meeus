import { Angle, AngleStyle } from '../angle';
import { UtcDate } from '../datetime/utcdate';
import { GeographicCoordinates } from './geographicCoordinates';
import { HorizontalCoordinates } from './horizontalCoordinates';
export declare class EquatorialCoordinates {
    private _ra;
    private _dec;
    private static RaPatternStyleMap;
    private static DecPatternStyleMap;
    constructor(rightAscension: Angle, declination: Angle);
    rightAscension: Angle;
    declination: Angle;
    toHorizontalCoordinates(date: UtcDate | Date, location: GeographicCoordinates): HorizontalCoordinates;
    toFormattedString(config: any): string;
    static parse(s: string, raStyle?: AngleStyle, decStyle?: AngleStyle): EquatorialCoordinates;
}
