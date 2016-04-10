import {Angle, AngleStyle, AngleNormalization, AngleParser} from '../angle';
import {UtcDate} from '../datetime/utcdate';
import {GeographicCoordinates} from './geographicCoordinates';
import {EquatorialCoordinates} from './equatorialCoordinates';
import {MeeusEngine} from '../core/meeusEngine';

export class HorizontalCoordinates {
    private _alt: Angle;
    private _az: Angle;
    
    private static RegexPatternStyleMap : any = {
        7: AngleStyle.Degree,
        11: AngleStyle.Degree
    };

    constructor(altitude: Angle, azimuth: Angle) {
        this.altitude = altitude;
        this.azimuth = azimuth;
    }

    get altitude(): Angle {
        return this._alt;
    }

    set altitude(val: Angle) {
        this._alt = val.normalize(-90, AngleNormalization.Reflective);
    }

    get azimuth(): Angle {
        return this._az;
    }

    set azimuth(val: Angle) {
        this._az = val.normalize();
    }

    public toEquatorialCoordinates(date: UtcDate | Date, location: GeographicCoordinates) : EquatorialCoordinates {
        return MeeusEngine.toEquatorialCoordinates(this, date, location);	
    }
    
    public toFormattedString(config : any) : string {
        config = config || {};
        if (config.digits == null) config.digits = 1;
        return this.altitude.toFormattedString({ format: 'D', digits: config.digits }) + ' ' + this.azimuth.toFormattedString({ format: 'D', digits: config.digits });	
    }
    
    public static parse(s: string, altStyle?: AngleStyle, azStyle?: AngleStyle) : HorizontalCoordinates {
        var tuple = AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, altStyle);
        if (!tuple.match) throw 's';
        var alt = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);

        tuple = AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, azStyle);
        if (!tuple.match) throw 's';
        var az = AngleParser.matchToAngle(tuple);

        return new HorizontalCoordinates(alt, az);      
    }
}