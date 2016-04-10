import { Angle } from '../angle';
import { LmsTime, LasTime, GasTime, GmsTime } from './siderealtimes';
import { HjdDate } from './hjddate';
import { TtDate } from './ttdate';
import { TaiDate } from './taidate';
import { GeographicCoordinates } from '../coordinateSystems/geographicCoordinates';
import { EquatorialCoordinates } from '../coordinateSystems/equatorialCoordinates';
export declare class UtcDate {
    private _days;
    /**
     *
     */
    constructor(days?: number);
    days: number;
    daysSinceJ2000: number;
    centuriesSinceJ2000: number;
    static J2000: UtcDate;
    static B1950: UtcDate;
    addDays(days: number): UtcDate;
    addHours(hours: number): UtcDate;
    addMinutes(minutes: number): UtcDate;
    addSeconds(seconds: number): UtcDate;
    addMilliseconds(milliseconds: number): UtcDate;
    toDate(): Date;
    toLmsTime(location: GeographicCoordinates | Angle | number): LmsTime;
    toGmsTime(): GmsTime;
    toLasTime(location: GeographicCoordinates | Angle | number): LasTime;
    toGasTime(): GasTime;
    toTaiDate(): TaiDate;
    toTtDate(): TtDate;
    toHjdDate(location: GeographicCoordinates, position: EquatorialCoordinates): HjdDate;
    static fromDate(date: Date): UtcDate;
    static fromJ2000Centuries(centuries: number): UtcDate;
    private static isJulianCalendar(year, month, day);
    private static getJulianDays(date);
    static toUtcDays(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): number;
}
