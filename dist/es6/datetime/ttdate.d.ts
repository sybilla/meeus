export declare class TtDate {
    private _days;
    /**
     *
     */
    constructor(days?: number);
    days: number;
    daysSinceJ2000: number;
    centuriesSinceJ2000: number;
    addDays(days: number): TtDate;
    addHours(hours: number): TtDate;
    addMinutes(minutes: number): TtDate;
    addSeconds(seconds: number): TtDate;
    addMilliseconds(milliseconds: number): TtDate;
}
