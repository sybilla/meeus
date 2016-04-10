export class HjdDate {
    
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

    public addDays(days : number) : HjdDate
    {
        return new HjdDate(this.days + days);
    }

    public addHours(hours : number) : HjdDate
    {
        return new HjdDate(this.days + hours / 24);
    }

    public addMinutes(minutes : number) : HjdDate
    {
        return new HjdDate(this.days + minutes / 1440);
    }

    public addSeconds(seconds : number) : HjdDate
    {
        return new HjdDate(this.days + seconds / 86400);
    }

    public addMilliseconds(milliseconds : number) : HjdDate
    {
        return new HjdDate(this.days + milliseconds / 86400000);
    }
}