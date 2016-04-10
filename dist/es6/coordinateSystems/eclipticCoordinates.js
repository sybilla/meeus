import { AngleStyle, AngleNormalization, AngleParser } from '../angle';
export class EclipticCoordinates {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    get latitude() {
        return this._lat;
    }
    set latitude(val) {
        this._lat = val.normalize(-90, AngleNormalization.Reflective);
    }
    get longitude() {
        return this._lon;
    }
    set longitude(val) {
        this._lon = val.normalize(-180);
    }
    toFormattedString(config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits });
    }
    static parse(s, latStyle, lonStyle) {
        var tuple = AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, latStyle);
        if (!tuple.match)
            throw 's';
        var lat = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, lonStyle);
        if (!tuple.match)
            throw 's';
        var lon = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
        return new EclipticCoordinates(lat, lon);
    }
}
EclipticCoordinates.RegexPatternStyleMap = {
    7: AngleStyle.Degree,
    11: AngleStyle.Degree
};
//# sourceMappingURL=eclipticCoordinates.js.map