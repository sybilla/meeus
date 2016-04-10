"use strict";
var HjdDate = (function () {
    /**
     *
     */
    function HjdDate(days) {
        this._days = days;
    }
    Object.defineProperty(HjdDate.prototype, "days", {
        get: function () {
            return this._days;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HjdDate.prototype, "daysSinceJ2000", {
        get: function () {
            return this._days - 2451545.0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HjdDate.prototype, "centuriesSinceJ2000", {
        get: function () {
            return this.daysSinceJ2000 / 36525.0;
        },
        enumerable: true,
        configurable: true
    });
    HjdDate.prototype.addDays = function (days) {
        return new HjdDate(this.days + days);
    };
    HjdDate.prototype.addHours = function (hours) {
        return new HjdDate(this.days + hours / 24);
    };
    HjdDate.prototype.addMinutes = function (minutes) {
        return new HjdDate(this.days + minutes / 1440);
    };
    HjdDate.prototype.addSeconds = function (seconds) {
        return new HjdDate(this.days + seconds / 86400);
    };
    HjdDate.prototype.addMilliseconds = function (milliseconds) {
        return new HjdDate(this.days + milliseconds / 86400000);
    };
    return HjdDate;
}());
exports.HjdDate = HjdDate;
//# sourceMappingURL=hjddate.js.map