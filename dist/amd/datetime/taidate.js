define(["require", "exports"], function (require, exports) {
    "use strict";
    var TaiDate = (function () {
        /**
         *
         */
        function TaiDate(days) {
            this._days = days;
        }
        Object.defineProperty(TaiDate.prototype, "days", {
            get: function () {
                return this._days;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaiDate.prototype, "daysSinceJ2000", {
            get: function () {
                return this._days - 2451545.0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaiDate.prototype, "centuriesSinceJ2000", {
            get: function () {
                return this.daysSinceJ2000 / 36525.0;
            },
            enumerable: true,
            configurable: true
        });
        TaiDate.prototype.addDays = function (days) {
            return new TaiDate(this.days + days);
        };
        TaiDate.prototype.addHours = function (hours) {
            return new TaiDate(this.days + hours / 24);
        };
        TaiDate.prototype.addMinutes = function (minutes) {
            return new TaiDate(this.days + minutes / 1440);
        };
        TaiDate.prototype.addSeconds = function (seconds) {
            return new TaiDate(this.days + seconds / 86400);
        };
        TaiDate.prototype.addMilliseconds = function (milliseconds) {
            return new TaiDate(this.days + milliseconds / 86400000);
        };
        return TaiDate;
    }());
    exports.TaiDate = TaiDate;
});
//# sourceMappingURL=taidate.js.map