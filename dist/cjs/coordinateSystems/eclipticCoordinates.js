"use strict";
var angle_1 = require('../angle');
var EclipticCoordinates = (function () {
    function EclipticCoordinates(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Object.defineProperty(EclipticCoordinates.prototype, "latitude", {
        get: function () {
            return this._lat;
        },
        set: function (val) {
            this._lat = val.normalize(-90, angle_1.AngleNormalization.Reflective);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EclipticCoordinates.prototype, "longitude", {
        get: function () {
            return this._lon;
        },
        set: function (val) {
            this._lon = val.normalize(-180);
        },
        enumerable: true,
        configurable: true
    });
    EclipticCoordinates.prototype.toFormattedString = function (config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits });
    };
    EclipticCoordinates.parse = function (s, latStyle, lonStyle) {
        var tuple = angle_1.AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, latStyle);
        if (!tuple.match)
            throw 's';
        var lat = angle_1.AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = angle_1.AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, lonStyle);
        if (!tuple.match)
            throw 's';
        var lon = angle_1.AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
        return new EclipticCoordinates(lat, lon);
    };
    EclipticCoordinates.RegexPatternStyleMap = {
        7: angle_1.AngleStyle.Degree,
        11: angle_1.AngleStyle.Degree
    };
    return EclipticCoordinates;
}());
exports.EclipticCoordinates = EclipticCoordinates;
//# sourceMappingURL=eclipticCoordinates.js.map