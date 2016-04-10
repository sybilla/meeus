import { AngleStyle, AngleNormalization, AngleParser } from '../angle';
import { MeeusEngine } from '../core/meeusEngine';
export class HorizontalCoordinates {
    constructor(altitude, azimuth) {
        this.altitude = altitude;
        this.azimuth = azimuth;
    }
    get altitude() {
        return this._alt;
    }
    set altitude(val) {
        this._alt = val.normalize(-90, AngleNormalization.Reflective);
    }
    get azimuth() {
        return this._az;
    }
    set azimuth(val) {
        this._az = val.normalize();
    }
    toEquatorialCoordinates(date, location) {
        return MeeusEngine.toEquatorialCoordinates(this, date, location);
    }
    toFormattedString(config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.altitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.azimuth.toFormattedString({ format: 'D', digits: config.digits });
    }
    static parse(s, altStyle, azStyle) {
        var tuple = AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, altStyle);
        if (!tuple.match)
            throw 's';
        var alt = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, azStyle);
        if (!tuple.match)
            throw 's';
        var az = AngleParser.matchToAngle(tuple);
        return new HorizontalCoordinates(alt, az);
    }
}
HorizontalCoordinates.RegexPatternStyleMap = {
    7: AngleStyle.Degree,
    11: AngleStyle.Degree
};
//# sourceMappingURL=horizontalCoordinates.js.map