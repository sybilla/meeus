import { UtcDate } from '../datetime/utcdate';
import { MeeusEngine } from '../engine/meeusEngine';
export class Sun {
    static positionAt(date) {
        var utc = date;
        if (utc instanceof Date)
            utc = UtcDate.fromDate(date);
        return MeeusEngine.sunPositionAt(utc);
    }
}
//# sourceMappingURL=sun.js.map