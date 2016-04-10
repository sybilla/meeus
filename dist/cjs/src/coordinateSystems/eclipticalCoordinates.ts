import {Angle, AngleStyle, AngleNormalization, AngleParser} from '../angle';
import {UtcDate} from '../datetime/utcdate';
import {GeographicCoordinates} from './geographicCoordinates';
import {HorizontalCoordinates} from './horizontalCoordinates';

export class EclipticalCoordinates {
    private _lat: Angle;
    private _lon: Angle;

    private static RegexPatternStyleMap : any = {
        7: AngleStyle.Degree,
        10: AngleStyle.Degree
    };

    constructor(latitude: Angle, longitude: Angle) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    get latitude(): Angle {
        return this._lat;
    }

    set latitude(val: Angle) {
        this._lat = val.normalize(-90, AngleNormalization.Reflective);
    }

    get longitude(): Angle {
        return this._lon;
    }

    set longitude(val: Angle) {
        this._lon = val.normalize(-180);
    }

    public toFormattedString(config : any) : string {
        config = config || {};
        if (config.digits == null) config.digits = 1;
        return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits });	
    }
    
    public static parse(s: string, latStyle?: AngleStyle, lonStyle?: AngleStyle) : EclipticalCoordinates {
        var tuple = AngleParser.match(s, EclipticalCoordinates.RegexPatternStyleMap, latStyle);
        if (!tuple.match) throw 's';
        var lat = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);

        tuple = AngleParser.match(s, EclipticalCoordinates.RegexPatternStyleMap, lonStyle);
        if (!tuple.match) throw 's';
        var lon = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();

        return new EclipticalCoordinates(lat, lon);
    }
}