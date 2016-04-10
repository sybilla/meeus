"use strict";
var meeusEngine_1 = require('../core/meeusEngine');
var UtcDate = (function () {
    /**
     *
     */
    function UtcDate(days) {
        if (days === undefined)
            this._days = UtcDate.getJulianDays(new Date());
        else
            this._days = days;
    }
    Object.defineProperty(UtcDate.prototype, "days", {
        get: function () {
            return this._days;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UtcDate.prototype, "daysSinceJ2000", {
        get: function () {
            return this._days - 2451545.0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UtcDate.prototype, "centuriesSinceJ2000", {
        get: function () {
            return this.daysSinceJ2000 / 36525.0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UtcDate, "J2000", {
        get: function () {
            // 2000-01-01T12:00:00.000+00:00
            return new UtcDate(2451545);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UtcDate, "B1950", {
        get: function () {
            // 1949-12-31T22:09:00.000+00:00
            return new UtcDate(2433282.4229166666);
        },
        enumerable: true,
        configurable: true
    });
    UtcDate.prototype.addDays = function (days) {
        return new UtcDate(this.days + days);
    };
    UtcDate.prototype.addHours = function (hours) {
        return new UtcDate(this.days + hours / 24);
    };
    UtcDate.prototype.addMinutes = function (minutes) {
        return new UtcDate(this.days + minutes / 1440);
    };
    UtcDate.prototype.addSeconds = function (seconds) {
        return new UtcDate(this.days + seconds / 86400);
    };
    UtcDate.prototype.addMilliseconds = function (milliseconds) {
        return new UtcDate(this.days + milliseconds / 86400000);
    };
    UtcDate.prototype.toDate = function () {
        var ye;
        var mo;
        var utcDays = this.days;
        var A, B, C, D, E, F, Z;
        F = utcDays + 0.5;
        Z = Math.floor(F);
        F -= Z;
        if (Z < 2299161) {
            A = Z;
        }
        else {
            A = Math.floor((Z - 1867216.25) / 36524.25);
            A = Z + 1 + A - Math.floor(A / 4);
        }
        B = A + 1524;
        C = Math.floor((B - 122.1) / 365.25);
        D = Math.floor(365.25 * C);
        E = Math.floor((B - D) / 30.6);
        var dd = B - D - Math.floor(30.6001 * E) + F;
        mo = (E > 13) ? (0 | (E - 13)) : (0 | (E - 1));
        ye = (mo == 1) || (mo == 2) ? (0 | (C - 4715)) : (0 | (C - 4716));
        var hrs = (dd - (0 | dd)) * 24;
        var date = new Date(ye, mo - 1, (0 | dd));
        return new Date(date.getTime() + (hrs * 60 - date.getTimezoneOffset()) * 60000);
    };
    UtcDate.prototype.toLmsTime = function (location) {
        return meeusEngine_1.MeeusEngine.toLmsTime(this, location);
    };
    UtcDate.prototype.toGmsTime = function () {
        return meeusEngine_1.MeeusEngine.toGmsTime(this);
    };
    UtcDate.prototype.toLasTime = function (location) {
        return meeusEngine_1.MeeusEngine.toLasTime(this, location);
    };
    UtcDate.prototype.toGasTime = function () {
        return meeusEngine_1.MeeusEngine.toGasTime(this);
    };
    UtcDate.prototype.toTaiDate = function () {
        return meeusEngine_1.MeeusEngine.toTaiDate(this);
    };
    UtcDate.prototype.toTtDate = function () {
        return meeusEngine_1.MeeusEngine.toTtDate(this);
    };
    UtcDate.prototype.toHjdDate = function (location, position) {
        return meeusEngine_1.MeeusEngine.toHjdDate(this, location, position);
    };
    UtcDate.fromDate = function (date) {
        return new UtcDate(UtcDate.getJulianDays(date));
    };
    UtcDate.fromJ2000Centuries = function (centuries) {
        return new UtcDate(centuries * 36525.0 + 2451545.0);
    };
    UtcDate.isJulianCalendar = function (year, month, day) {
        if (year < 1582)
            return true;
        else if (year > 1582)
            return false;
        else {
            // If 1582, check before October 4 (Julian) or after October 15 (Gregorian)
            if (month < 10)
                return true;
            else if (month > 10)
                return false;
            else {
                if (day < 5)
                    return true;
                else if (day > 14)
                    return false;
                else
                    // Any date in the range 10/5/1582 to 10/14/1582 is invalid 
                    throw "This date is not valid as it does not exist in either the Julian or the Gregorian calendars.";
            }
        }
    };
    UtcDate.getJulianDays = function (date) {
        var Y = date.getUTCFullYear();
        var M = date.getUTCMonth();
        var D = date.getUTCDate();
        var h = date.getUTCHours();
        var m = date.getUTCMinutes();
        var s = date.getUTCSeconds();
        var ms = date.getUTCMilliseconds();
        return UtcDate.toUtcDays(Y, M, D, h, m, s, ms);
    };
    UtcDate.toUtcDays = function (year, month, day, hour, minute, second, millisecond) {
        month += 1;
        hour = hour || 0;
        minute = minute || 0;
        second = second || 0;
        millisecond = millisecond || 0;
        var isValid = UtcDate.isJulianCalendar(year, month, day);
        var M = month > 2 ? month : month + 12;
        var Y = month > 2 ? year : year - 1;
        var A = Math.floor(Y / 100);
        var D = Math.floor(30.6001 * (M + 1));
        var B = isValid ? 0 : 2 - A + Math.floor(A / 4);
        var C = Math.floor(365.25 * (Y + 4716));
        return B + C + D - 1524.5 + day + hour / 24 + minute / 1440 + (second + millisecond / 1000) / 86400;
    };
    return UtcDate;
}());
exports.UtcDate = UtcDate;
//# sourceMappingURL=utcdate.js.map