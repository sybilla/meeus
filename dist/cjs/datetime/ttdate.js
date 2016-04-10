"use strict";
var TtDate = (function () {
    /**
     *
     */
    function TtDate(days) {
        this._days = days;
    }
    Object.defineProperty(TtDate.prototype, "days", {
        get: function () {
            return this._days;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TtDate.prototype, "daysSinceJ2000", {
        get: function () {
            return this._days - 2451545.0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TtDate.prototype, "centuriesSinceJ2000", {
        get: function () {
            return this.daysSinceJ2000 / 36525.0;
        },
        enumerable: true,
        configurable: true
    });
    TtDate.prototype.addDays = function (days) {
        return new TtDate(this.days + days);
    };
    TtDate.prototype.addHours = function (hours) {
        return new TtDate(this.days + hours / 24);
    };
    TtDate.prototype.addMinutes = function (minutes) {
        return new TtDate(this.days + minutes / 1440);
    };
    TtDate.prototype.addSeconds = function (seconds) {
        return new TtDate(this.days + seconds / 86400);
    };
    TtDate.prototype.addMilliseconds = function (milliseconds) {
        return new TtDate(this.days + milliseconds / 86400000);
    };
    return TtDate;
}());
exports.TtDate = TtDate;
//# sourceMappingURL=ttdate.js.map