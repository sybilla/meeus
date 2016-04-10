"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utcdate_1 = require('./utcdate');
var __BaseTime = (function () {
    /**
     *
     */
    function __BaseTime(hours) {
        this._hours = hours;
    }
    Object.defineProperty(__BaseTime.prototype, "hours", {
        get: function () {
            return this._hours;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "hour", {
        get: function () {
            return (0 | this._hours);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "minutes", {
        get: function () {
            return (this.hours - this.hour) * 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "minute", {
        get: function () {
            return (0 | this.minutes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "seconds", {
        get: function () {
            return (this.minutes - this.minute) * 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "second", {
        get: function () {
            return (0 | this.seconds);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "milliseconds", {
        get: function () {
            return (this.seconds - this.second) * 1000;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "millisecond", {
        get: function () {
            return (0 | this.milliseconds);
        },
        enumerable: true,
        configurable: true
    });
    __BaseTime.prototype.toFormattedString = function () {
        var seconds = Math.round(this.seconds);
        var minutes = Math.round(this.minute);
        var hour = this.hour;
        if (seconds == 60) {
            minutes += 1;
            seconds = 0;
        }
        if (minutes >= 60) {
            hour += 1;
            minutes -= 60;
        }
        return hour + ':' + __BaseTime.absPad(minutes) + ':' + __BaseTime.absPad(seconds);
    };
    __BaseTime.absPad = function (val, fixed) {
        var fixedValue = Math.abs(val).toFixed(fixed || 0);
        var fixedNumber = parseFloat(fixedValue);
        return ((fixedNumber < 10 && fixedNumber > -10) ? '0' : '') + fixedValue;
    };
    return __BaseTime;
}());
exports.__BaseTime = __BaseTime;
var GmsTime = (function (_super) {
    __extends(GmsTime, _super);
    function GmsTime() {
        _super.apply(this, arguments);
    }
    GmsTime.fromDate = function (date) {
        return utcdate_1.UtcDate.fromDate(date).toGmsTime();
    };
    return GmsTime;
}(__BaseTime));
exports.GmsTime = GmsTime;
var LmsTime = (function (_super) {
    __extends(LmsTime, _super);
    function LmsTime() {
        _super.apply(this, arguments);
    }
    return LmsTime;
}(__BaseTime));
exports.LmsTime = LmsTime;
var GasTime = (function (_super) {
    __extends(GasTime, _super);
    function GasTime() {
        _super.apply(this, arguments);
    }
    GasTime.fromDate = function (date) {
        return utcdate_1.UtcDate.fromDate(date).toGasTime();
    };
    return GasTime;
}(__BaseTime));
exports.GasTime = GasTime;
var LasTime = (function (_super) {
    __extends(LasTime, _super);
    function LasTime() {
        _super.apply(this, arguments);
    }
    return LasTime;
}(__BaseTime));
exports.LasTime = LasTime;
//# sourceMappingURL=siderealtimes.js.map