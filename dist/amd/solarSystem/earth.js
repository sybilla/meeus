define(["require", "exports", '../core/meeusEngine', '../datetime/utcdate'], function (require, exports, meeusEngine_1, utcdate_1) {
    "use strict";
    var Earth = (function () {
        function Earth() {
        }
        Earth.orbitalEccentricity = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.earthCartesianPositionAt(utc);
        };
        /**
         * @param date  Specifies the date of the position calculation.
         * @returns     Cartesian position of Earth with respect to the Sun.
         */
        Earth.cartesianPositionAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.earthCartesianPositionAt(utc);
        };
        /**
         * @param date  Specifies the date of the velocity calculation.
         * @returns     Cartesian velocity of Earth with respect to the Sun.
         */
        Earth.cartesianVelocityAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.earthCartesianVelocityAt(utc);
        };
        return Earth;
    }());
    exports.Earth = Earth;
});
//# sourceMappingURL=earth.js.map