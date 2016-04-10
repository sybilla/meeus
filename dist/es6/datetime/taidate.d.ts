export declare class TaiDate {
    private _days;
    /**
     *
     */
    constructor(days?: number);
    days: number;
    daysSinceJ2000: number;
    centuriesSinceJ2000: number;
    addDays(days: number): TaiDate;
    addHours(hours: number): TaiDate;
    addMinutes(minutes: number): TaiDate;
    addSeconds(seconds: number): TaiDate;
    addMilliseconds(milliseconds: number): TaiDate;
}
