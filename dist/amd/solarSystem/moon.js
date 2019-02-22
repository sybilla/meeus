define(["require", "exports", '../datetime/utcdate', '../engine/meeusEngine'], function (require, exports, utcdate_1, meeusEngine_1) {
    "use strict";
    var Moon = (function () {
        function Moon() {
        }
        Moon.positionAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.moonPositionAt(utc);
        };
        Moon.terminatorLongitudeAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.calc_Moon_LongitudeOfTerminator(utc);
        };
        Moon.illuminatedDiscFractionAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.calc_Moon_IlluminatedDiscFraction(utc);
        };
        return Moon;
    }());
    exports.Moon = Moon;
});
//# sourceMappingURL=moon.js.map