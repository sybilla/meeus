import { AngleStyle, AngleNormalization, AngleParser } from '../angle';
import { MeeusEngine } from '../core/meeusEngine';
export class EquatorialCoordinates {
    constructor(rightAscension, declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }
    get rightAscension() {
        return this._ra;
    }
    set rightAscension(val) {
        this._ra = val.normalize();
    }
    get declination() {
        return this._dec;
    }
    set declination(val) {
        this._dec = val.normalize(-90, AngleNormalization.Reflective);
    }
    toHorizontalCoordinates(date, location) {
        return MeeusEngine.toHorizontalCoordinates(this, date, location);
    }
    toFormattedString(config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.rightAscension.toFormattedString({ format: 'H', digits: config.digits }) + ' ' + this.declination.toFormattedString({ format: 'D', digits: config.digits });
    }
    static parse(s, raStyle, decStyle) {
        var tuple = AngleParser.match(s, EquatorialCoordinates.RaPatternStyleMap, raStyle);
        if (!tuple.match)
            throw 's';
        var ra = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = AngleParser.match(s, EquatorialCoordinates.DecPatternStyleMap, decStyle);
        if (!tuple.match)
            throw 's';
        var dec = AngleParser.matchToAngle(tuple);
        return new EquatorialCoordinates(ra, dec);
    }
}
EquatorialCoordinates.RaPatternStyleMap = {
    1: AngleStyle.Hour,
    3: AngleStyle.Hour,
    8: AngleStyle.Hour,
    9: AngleStyle.Hour,
    11: AngleStyle.Hour
};
EquatorialCoordinates.DecPatternStyleMap = {
    7: AngleStyle.Degree,
    11: AngleStyle.Degree
};
//# sourceMappingURL=equatorialCoordinates.js.map