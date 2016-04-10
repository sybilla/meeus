import {MeeusEngine, Vector} from '../core/meeusEngine';
import {UtcDate} from '../datetime/utcdate';
import {EquatorialCoordinates} from '../coordinateSystems/equatorialCoordinates';

export class Earth {

    public static orbitalEccentricity(date: UtcDate | Date) : Vector {
        var utc : any = date;			
	    if (utc instanceof Date)
	        utc = UtcDate.fromDate(<Date>date);	
        return MeeusEngine.earthCartesianPositionAt(utc);				
    }
        
    /**
     * @param date  Specifies the date of the position calculation.
     * @returns     Cartesian position of Earth with respect to the Sun.
     */
    public static cartesianPositionAt(date : UtcDate | Date) : Vector { 
        var utc : any = date;			
	    if (utc instanceof Date)
	        utc = UtcDate.fromDate(<Date>date);	
        return MeeusEngine.earthCartesianPositionAt(utc);
    }
    
    /**
     * @param date  Specifies the date of the velocity calculation.
     * @returns     Cartesian velocity of Earth with respect to the Sun.
     */
    public static cartesianVelocityAt(date : UtcDate | Date) : Vector { 
        var utc : any = date;			
	    if (utc instanceof Date)
	        utc = UtcDate.fromDate(<Date>date);	
        return MeeusEngine.earthCartesianVelocityAt(utc);
    }
}