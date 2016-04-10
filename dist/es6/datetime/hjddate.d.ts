export declare class HjdDate {
    private _days;
    /**
     *
     */
    constructor(days?: number);
    days: number;
    daysSinceJ2000: number;
    centuriesSinceJ2000: number;
    addDays(days: number): HjdDate;
    addHours(hours: number): HjdDate;
    addMinutes(minutes: number): HjdDate;
    addSeconds(seconds: number): HjdDate;
    addMilliseconds(milliseconds: number): HjdDate;
}
