import { AngleStyle, AngleNormalization, AngleParser } from '../angle';
import { MeeusEngine } from '../core/meeusEngine';
export class GeographicCoordinates {
    constructor(latitude, longitude, altitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this._alt = altitude || 0;
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
    get altitude() {
        return this._alt;
    }
    sunrise(date, twilight) {
        return MeeusEngine.getSunriseAt(this, date, twilight);
    }
    sunset(date, twilight) {
        return MeeusEngine.getSunsetAt(this, date, twilight);
    }
    toFormattedString(config) {
        config = config || {};
        if (config.digits == null)
            config.digits = 1;
        return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.altitude;
    }
    static parse(s, latStyle, lonStyle) {
        var tuple = AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, latStyle);
        if (!tuple.match)
            throw 's';
        var lat = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
        tuple = AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, lonStyle);
        if (!tuple.match)
            throw 's';
        var lon = AngleParser.matchToAngle(tuple);
        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
        var alt = parseFloat(s);
        if (isNaN(alt))
            alt = 0;
        return new GeographicCoordinates(lat, lon, alt);
    }
}
GeographicCoordinates.RegexPatternStyleMap = {
    7: AngleStyle.Degree,
    11: AngleStyle.Degree
};
//# sourceMappingURL=geographicCoordinates.js.map