import { EquatorialCoordinates } from '../coordinateSystems/equatorialCoordinates';
import { UtcDate } from '../datetime/utcdate';
export declare class Sun {
    static positionAt(date: UtcDate | Date): EquatorialCoordinates;
}
