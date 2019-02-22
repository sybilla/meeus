import {EquatorialCoordinates} from '../coordinateSystems/equatorialCoordinates';
import {UtcDate} from '../datetime/utcdate';
import {MeeusEngine, Vector} from '../engine/meeusEngine';

export class Sun {
    public static positionAt(date: UtcDate | Date) : EquatorialCoordinates {
        var utc : any = date;			
        if (utc instanceof Date)
            utc = UtcDate.fromDate(<Date>date);				
        return  MeeusEngine.sunPositionAt(utc);
    }
}