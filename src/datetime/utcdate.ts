import {Angle} from '../angle';
import {LmsTime, LasTime, GasTime, GmsTime} from './siderealtimes';
import {HjdDate} from './hjddate';
import {TtDate} from './ttdate';
import {TaiDate} from './taidate';
import {GeographicCoordinates} from '../coordinateSystems/geographicCoordinates';
import {EquatorialCoordinates} from '../coordinateSystems/equatorialCoordinates';
import {MeeusEngine} from '../core/meeusEngine';

export class UtcDate {
    private _days : number;
    
    /**
     *
     */
    constructor(days: number) {
        if (days === undefined) this._days = UtcDate.getJulianDays(new Date());
        else this._days = days;
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
    
    public static get J2000() : UtcDate {
        // 2000-01-01T12:00:00.000+00:00
        return new UtcDate(2451545);
    }
    
    public static get B1950() : UtcDate {
        // 1949-12-31T22:09:00.000+00:00
        return new UtcDate(2433282.4229166666);
    }
    
    public addDays(days : number) : UtcDate
    {
        return new UtcDate(this.days + days);
    }

    public addHours(hours : number) : UtcDate
    {
        return new UtcDate(this.days + hours / 24);
    }

    public addMinutes(minutes : number) : UtcDate
    {
        return new UtcDate(this.days + minutes / 1440);
    }

    public addSeconds(seconds : number) : UtcDate
    {
        return new UtcDate(this.days + seconds / 86400);
    }

    public addMilliseconds(milliseconds : number) : UtcDate
    {
        return new UtcDate(this.days + milliseconds / 86400000);
    }

    public toDate() : Date {
        var ye: number;
        var mo: number;
        var utcDays : number = this.days;
        var A, B, C, D, E, F, Z;

        F = utcDays + 0.5;
        Z = Math.floor(F);
        F -= Z;

        if (Z < 2299161)
        {
            A = Z;
        }
        else
        {
            A = Math.floor((Z - 1867216.25) / 36524.25);
            A = Z + 1 + A - Math.floor(A / 4);
        }

        B = A + 1524;
        C = Math.floor((B - 122.1) / 365.25);
        D = Math.floor(365.25 * C);
        E = Math.floor((B - D) / 30.6);

        var dd = B - D - Math.floor(30.6001 * E) + F;

        mo = (E > 13) ? (0 | (E - 13)) : (0 | (E - 1));
        ye = (mo == 1) || (mo == 2) ? (0 | (C - 4715)) : (0 | (C - 4716));
        
        var hrs = (dd - (0 | dd)) * 24;

        var date = new Date(ye, mo - 1, (0 | dd));
        return new Date(date.getTime() + (hrs * 60 - date.getTimezoneOffset()) * 60000);
    }
    
    public toLmsTime(location: GeographicCoordinates | Angle | number) : LmsTime {
        return MeeusEngine.toLmsTime(this, location);
    }
    
    public toGmsTime() : GmsTime {
        return MeeusEngine.toGmsTime(this);
    }
    
    public toLasTime(location: GeographicCoordinates | Angle | number) : LasTime {
        return MeeusEngine.toLasTime(this, location)
    }
    
    public toGasTime() : GasTime {
        return MeeusEngine.toGasTime(this);
    }
    
    public toTaiDate() : TaiDate {
        return MeeusEngine.toTaiDate(this);
    }
    
    public toTtDate() : TtDate {
        return  MeeusEngine.toTtDate(this);
    }
    
    public toHjdDate(location : GeographicCoordinates, position : EquatorialCoordinates) : HjdDate {
        return  MeeusEngine.toHjdDate(this, location, position);
    }
    
    public static fromDate(date: Date) : UtcDate {
        return new UtcDate(UtcDate.getJulianDays(date));
    }
    
    public static fromJ2000Centuries(centuries: number) : UtcDate {
        return new UtcDate(centuries * 36525.0 + 2451545.0);
    }
    
    private static isJulianCalendar(year: number, month: number, day: number) : boolean {
        if (year < 1582) return true;
        // All dates after 1582 are in the Gregorian calendar
        else if (year > 1582)
            return false;
        else
        {
            // If 1582, check before October 4 (Julian) or after October 15 (Gregorian)
            if (month < 10)
                return true;
            else if (month > 10)
                return false;
            else
            {
                if (day < 5)
                    return true;
                else if (day > 14)
                    return false;
                else
                    // Any date in the range 10/5/1582 to 10/14/1582 is invalid 
                    throw "This date is not valid as it does not exist in either the Julian or the Gregorian calendars.";
            }
        }			
    }
    
    private static getJulianDays(date: Date) : number {
        var Y = date.getUTCFullYear();
        var M = date.getUTCMonth();
        var D = date.getUTCDate();
        var h = date.getUTCHours();
        var m = date.getUTCMinutes();
        var s = date.getUTCSeconds();
        var ms = date.getUTCMilliseconds(); 
        return UtcDate.toUtcDays(Y, M, D, h, m, s, ms);	
    }
    
    public static toUtcDays(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number) : number {
        month += 1;
        hour = hour || 0;
        minute = minute || 0;
        second = second || 0;
        millisecond = millisecond || 0;
        
        var isValid = UtcDate.isJulianCalendar(year, month, day);
        var M = month > 2 ? month : month + 12;
        var Y = month > 2 ? year : year - 1;
        var A = Math.floor(Y / 100);
        var D = Math.floor(30.6001 * (M + 1));
        var B = isValid ? 0 : 2 - A + Math.floor(A / 4);
        var C = Math.floor(365.25 * (Y + 4716));

        return  B + C + D - 1524.5 + day + hour / 24 + minute / 1440 + (second + millisecond / 1000) / 86400;			
    }
}