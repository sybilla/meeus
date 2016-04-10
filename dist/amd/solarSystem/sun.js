define(["require", "exports", '../datetime/utcdate', '../core/meeusEngine'], function (require, exports, utcdate_1, meeusEngine_1) {
    "use strict";
    var Sun = (function () {
        function Sun() {
        }
        Sun.positionAt = function (date) {
            var utc = date;
            if (utc instanceof Date)
                utc = utcdate_1.UtcDate.fromDate(date);
            return meeusEngine_1.MeeusEngine.sunPositionAt(utc);
        };
        return Sun;
    }());
    exports.Sun = Sun;
});
//# sourceMappingURL=sun.js.map