import {Angle, AngleStyle, AngleNormalization, AngleParser} from '../angle';
import {UtcDate} from '../datetime/utcdate';
import {Twilight,MeeusEngine} from '../engine/meeusEngine';


export class GeographicCoordinates {
    private _lat: Angle;
    private _lon: Angle;
    private _alt: number;

    private static RegexPatternStyleMap : any = {
        7: AngleStyle.Degree,
        11: AngleStyle.Degree
    };

    constructor(latitude: Angle, longitude: Angle, altitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this._alt = altitude || 0;
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

    get altitude(): number {
        return this._alt;
    }

    public sunrise(date : UtcDate | Date, twilight : Twilight) : UtcDate {
        return MeeusEngine.getSunriseAt(this, date, twilight);
    }
    
    public sunset(date : UtcDate | Date, twilight : Twilight) : UtcDate {
        return MeeusEngine.getSunsetAt(this, date, twilight);
    }
    
    public toFormattedString(config : any) : string {
        config = config || {};
        if (config.digits == null) config.digits = 1;
        return this.latitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.longitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.altitude;	
    }
    
    public static parse(s: string, latStyle?: AngleStyle, lonStyle?: AngleStyle) : GeographicCoordinates {
        var tuple = AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, latStyle);
        if (!tuple.match) throw 's';
        var lat = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);

        tuple = AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, lonStyle);
        if (!tuple.match) throw 's';
        var lon = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();

        var alt : number = parseFloat(s);

        if (isNaN(alt)) alt = 0;

        return new GeographicCoordinates(lat, lon, alt);
    }
}