"use strict";
var angle_1 = require('../angle');
var meeusEngine_1 = require('../core/meeusEngine');
var EquatorialCoordinates = (function () {
    function EquatorialCoordinates(rightAscension, declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }
    Object.defineProperty(EquatorialCoordinates.prototype, "rightAscension", {
        get: function () {
            return this._ra;
        },
        set: function (val) {
            this._ra = val.normalize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EquatorialCoordinates.prototype, "declination", {
        get: function () {
            return this._dec;
        },
        set: function (val) {
            this._dec = val.normalize(-90, angle_1.AngleNormalization.Reflective);
        },
        enumerable: true,
        configurable: true
    });
    EquatorialCoordinates.prototype.toHorizontalCoordinates = function (date, location) {
        return meeusEngine_1.MeeusEngine.toHorizontalCoordinates(this, date, location);
    };
    EquatorialCoordinates.prototype.toFormattedString = function (config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.rightAscension.toFormattedString({ format: 'H', digits: config.digits }) + ' ' + this.declination.toFormattedString({ format: 'D', digits: config.digits });
    };
    EquatorialCoordinates.parse = function (s, raStyle, decStyle) {
        var tuple = angle_1.AngleParser.match(s, EquatorialCoordinates.RaPatternStyleMap, raStyle);
        if (!tuple.match)
            throw 's';
        var ra = angle_1.AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = angle_1.AngleParser.match(s, EquatorialCoordinates.DecPatternStyleMap, decStyle);
        if (!tuple.match)
            throw 's';
        var dec = angle_1.AngleParser.matchToAngle(tuple);
        return new EquatorialCoordinates(ra, dec);
    };
    EquatorialCoordinates.RaPatternStyleMap = {
        1: angle_1.AngleStyle.Hour,
        3: angle_1.AngleStyle.Hour,
        8: angle_1.AngleStyle.Hour,
        11: angle_1.AngleStyle.Hour
    };
    EquatorialCoordinates.DecPatternStyleMap = {
        7: angle_1.AngleStyle.Degree,
        11: angle_1.AngleStyle.Degree
    };
    return EquatorialCoordinates;
}());
exports.EquatorialCoordinates = EquatorialCoordinates;
//# sourceMappingURL=equatorialCoordinates.js.map