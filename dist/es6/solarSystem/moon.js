import { UtcDate } from '../datetime/utcdate';
import { MeeusEngine } from '../engine/meeusEngine';
export class Moon {
    static positionAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.moonPositionAt(utc);
    }
    static terminatorLongitudeAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.calc_Moon_LongitudeOfTerminator(utc);
    }
    static illuminatedDiscFractionAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.calc_Moon_IlluminatedDiscFraction(utc);
    }
}
//# sourceMappingURL=moon.js.map