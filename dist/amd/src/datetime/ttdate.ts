export class TtDate {
    
    private _days : number;
    
    /**
     *
     */
    constructor(days?: number) {
        this._days = days;
    }	
    
    public get days() : number {
        return this._days;
    }
    
    public get daysSinceJ2000() : number {
        return this._days - 2451545.0;
    }
    
    public get centuriesSinceJ2000() : number {
        return this.daysSinceJ2000 / 36525.0;
    }

    public addDays(days : number) : TtDate
    {
        return new TtDate(this.days + days);
    }

    public addHours(hours : number) : TtDate
    {
        return new TtDate(this.days + hours / 24);
    }

    public addMinutes(minutes : number) : TtDate
    {
        return new TtDate(this.days + minutes / 1440);
    }

    public addSeconds(seconds : number) : TtDate
    {
        return new TtDate(this.days + seconds / 86400);
    }

    public addMilliseconds(milliseconds : number) : TtDate
    {
        return new TtDate(this.days + milliseconds / 86400000);
    }
}