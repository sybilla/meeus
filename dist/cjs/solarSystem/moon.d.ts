import { EquatorialCoordinates } from '../coordinateSystems/equatorialCoordinates';
import { UtcDate } from '../datetime/utcdate';
import { Angle } from '../angle';
export declare class Moon {
    static positionAt(date: UtcDate | Date): EquatorialCoordinates;
    static terminatorLongitudeAt(date: UtcDate | Date): Angle;
    static illuminatedDiscFractionAt(date: UtcDate | Date): number;
}
