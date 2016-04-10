export declare class __BaseTime {
    protected _hours: number;
    /**
     *
     */
    constructor(hours: number);
    hours: number;
    hour: number;
    minutes: number;
    minute: number;
    seconds: number;
    second: number;
    milliseconds: number;
    millisecond: number;
    toFormattedString(): string;
    private static absPad(val, fixed?);
}
export declare class GmsTime extends __BaseTime {
    static fromDate(date: Date): GmsTime;
}
export declare class LmsTime extends __BaseTime {
}
export declare class GasTime extends __BaseTime {
    static fromDate(date: Date): GasTime;
}
export declare class LasTime extends __BaseTime {
}
