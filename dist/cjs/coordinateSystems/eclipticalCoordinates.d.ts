import { Angle, AngleStyle } from '../angle';
export declare class EclipticalCoordinates {
    private _lat;
    private _lon;
    private static RegexPatternStyleMap;
    constructor(latitude: Angle, longitude: Angle);
    latitude: Angle;
    longitude: Angle;
    toFormattedString(config: any): string;
    static parse(s: string, latStyle?: AngleStyle, lonStyle?: AngleStyle): EclipticalCoordinates;
}
