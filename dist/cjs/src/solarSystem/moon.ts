import {EquatorialCoordinates} from '../coordinateSystems/equatorialCoordinates';
import {UtcDate} from '../datetime/utcdate';
import {Angle} from '../angle';
import {MeeusEngine} from '../core/meeusEngine';

export class Moon {
    
    public static positionAt(date: UtcDate | Date): EquatorialCoordinates {
        var utc: any = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(<Date>date);
        return MeeusEngine.moonPositionAt(utc);
    }

    public static terminatorLongitudeAt(date: UtcDate | Date): Angle {
        var utc: any = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(<Date>date);
        return MeeusEngine.calc_Moon_LongitudeOfTerminator(utc);
    }

    public static illuminatedDiscFractionAt(date: UtcDate | Date): number {
        var utc: any = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(<Date>date);
        return MeeusEngine.calc_Moon_IlluminatedDiscFraction(utc);
    }
    
}