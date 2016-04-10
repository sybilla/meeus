define(["require", "exports", '../angle', '../core/meeusEngine'], function (require, exports, angle_1, meeusEngine_1) {
    "use strict";
    var GeographicCoordinates = (function () {
        function GeographicCoordinates(latitude, longitude, altitude) {
            this.latitude = latitude;
            this.longitude = longitude;
            this._alt = altitude || 0;
        }
        Object.defineProperty(GeographicCoordinates.prototype, "latitude", {
            get: function () {
                return this._lat;
            },
            set: function (val) {
                this._lat = val.normalize(-90, angle_1.AngleNormalization.Reflective);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographicCoordinates.prototype, "longitude", {
            get: function () {
                return this._lon;
            },
            set: function (val) {
                this._lon = val.normalize(-180);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographicCoordinates.prototype, "altitude", {
            get: function () {
                return this._alt;
            },
            enumerable: true,
            configurable: true
        });
        GeographicCoordinates.prototype.sunrise = function (date, twilight) {
            return meeusEngine_1.MeeusEngine.getSunriseAt(this, date, twilight);
        };
        GeographicCoordinates.prototype.sunset = function (date, twilight) {
            return meeusEngine_1.MeeusEngine.getSunsetAt(this, date, twilight);
        };
        GeographicCoordinates.prototype.toFormattedString = function (config) {
            config = config || {};
            if (config.digits == null)
                config.digits = 1;
            return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.altitude;
        };
        GeographicCoordinates.parse = function (s, latStyle, lonStyle) {
            var tuple = angle_1.AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, latStyle);
            if (!tuple.match)
                throw 's';
            var lat = angle_1.AngleParser.matchToAngle(tuple);
            s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
            tuple = angle_1.AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, lonStyle);
            if (!tuple.match)
                throw 's';
            var lon = angle_1.AngleParser.matchToAngle(tuple);
            s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
            var alt = parseFloat(s);
            if (isNaN(alt))
                alt = 0;
            return new GeographicCoordinates(lat, lon, alt);
        };
        GeographicCoordinates.RegexPatternStyleMap = {
            7: angle_1.AngleStyle.Degree,
            11: angle_1.AngleStyle.Degree
        };
        return GeographicCoordinates;
    }());
    exports.GeographicCoordinates = GeographicCoordinates;
});
//# sourceMappingURL=geographicCoordinates.js.map