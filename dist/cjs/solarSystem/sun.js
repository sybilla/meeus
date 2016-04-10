"use strict";
var utcdate_1 = require('../datetime/utcdate');
var meeusEngine_1 = require('../core/meeusEngine');
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
//# sourceMappingURL=sun.js.map