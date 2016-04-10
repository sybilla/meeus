define(["require", "exports", '../angle', '../core/meeusEngine'], function (require, exports, angle_1, meeusEngine_1) {
    "use strict";
    var HorizontalCoordinates = (function () {
        function HorizontalCoordinates(altitude, azimuth) {
            this.altitude = altitude;
            this.azimuth = azimuth;
        }
        Object.defineProperty(HorizontalCoordinates.prototype, "altitude", {
            get: function () {
                return this._alt;
            },
            set: function (val) {
                this._alt = val.normalize(-90, angle_1.AngleNormalization.Reflective);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HorizontalCoordinates.prototype, "azimuth", {
            get: function () {
                return this._az;
            },
            set: function (val) {
                this._az = val.normalize();
            },
            enumerable: true,
            configurable: true
        });
        HorizontalCoordinates.prototype.toEquatorialCoordinates = function (date, location) {
            return meeusEngine_1.MeeusEngine.toEquatorialCoordinates(this, date, location);
        };
        HorizontalCoordinates.prototype.toFormattedString = function (config) {
            config = config || {};
            if (config.digits == null)
                config.digits = 1;
            return this.altitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.azimuth.toFormattedString({ format: 'D', digits: config.digits });
        };
        HorizontalCoordinates.parse = function (s, altStyle, azStyle) {
            var tuple = angle_1.AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, altStyle);
            if (!tuple.match)
                throw 's';
            var alt = angle_1.AngleParser.matchToAngle(tuple);
            s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
            tuple = angle_1.AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, azStyle);
            if (!tuple.match)
                throw 's';
            var az = angle_1.AngleParser.matchToAngle(tuple);
            return new HorizontalCoordinates(alt, az);
        };
        HorizontalCoordinates.RegexPatternStyleMap = {
            7: angle_1.AngleStyle.Degree,
            10: angle_1.AngleStyle.Degree
        };
        return HorizontalCoordinates;
    }());
    exports.HorizontalCoordinates = HorizontalCoordinates;
});
//# sourceMappingURL=horizontalCoordinates.js.map