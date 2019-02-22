import { Vector } from '../engine/meeusEngine';
import { UtcDate } from '../datetime/utcdate';
export declare class Earth {
    static orbitalEccentricity(date: UtcDate | Date): Vector;
    /**
     * @param date  Specifies the date of the position calculation.
     * @returns     Cartesian position of Earth with respect to the Sun.
     */
    static cartesianPositionAt(date: UtcDate | Date): Vector;
    /**
     * @param date  Specifies the date of the velocity calculation.
     * @returns     Cartesian velocity of Earth with respect to the Sun.
     */
    static cartesianVelocityAt(date: UtcDate | Date): Vector;
}
