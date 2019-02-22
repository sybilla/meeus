import { MeeusEngine } from '../engine/meeusEngine';
import { UtcDate } from '../datetime/utcdate';
export class Earth {
    static orbitalEccentricity(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.earthCartesianPositionAt(utc);
    }
    /**
     * @param date  Specifies the date of the position calculation.
     * @returns     Cartesian position of Earth with respect to the Sun.
     */
    static cartesianPositionAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.earthCartesianPositionAt(utc);
    }
    /**
     * @param date  Specifies the date of the velocity calculation.
     * @returns     Cartesian velocity of Earth with respect to the Sun.
     */
    static cartesianVelocityAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.earthCartesianVelocityAt(utc);
    }
}
//# sourceMappingURL=earth.js.map