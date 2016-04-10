import {Angle, AngleStyle, AngleNormalization, AngleParser} from '../angle';
import {UtcDate} from '../datetime/utcdate';
import {GeographicCoordinates} from './geographicCoordinates';
import {HorizontalCoordinates} from './horizontalCoordinates';
import {Twilight, MeeusEngine} from '../core/meeusEngine';

export class EquatorialCoordinates {
    private _ra: Angle;
    private _dec: Angle;

    private static RaPatternStyleMap : any = {
        1: AngleStyle.Hour,
        3: AngleStyle.Hour,
        8: AngleStyle.Hour,
        10: AngleStyle.Hour
    };

    private static DecPatternStyleMap : any = {
            7: AngleStyle.Degree,
        10: AngleStyle.Degree
    };

    constructor(rightAscension: Angle, declination: Angle) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    get rightAscension(): Angle {
        return this._ra;
    }

    set rightAscension(val : Angle) {
        this._ra = val.normalize();
    }

    get declination(): Angle {
        return this._dec;
    }

    set declination(val : Angle) {
        this._dec = val.normalize(-90, AngleNormalization.Reflective);
    }

    public toHorizontalCoordinates(date: UtcDate | Date, location: GeographicCoordinates) : HorizontalCoordinates {
        return MeeusEngine.toHorizontalCoordinates(this, date, location);
    }

    public toFormattedString(config : any) : string {
        config = config || {};
        if (config.digits == null) config.digits = 1;
        return this.rightAscension.toFormattedString({ format: 'H', digits: config.digits }) + ' ' + this.declination.toFormattedString({ format: 'D', digits: config.digits });	
    }
    
    public static parse(s: string, raStyle?: AngleStyle, decStyle?: AngleStyle) : EquatorialCoordinates {
        var tuple = AngleParser.match(s, EquatorialCoordinates.RaPatternStyleMap, raStyle);
        if (!tuple.match) throw 's';
        var ra = AngleParser.matchToAngle(tuple);

        s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);

        tuple = AngleParser.match(s, EquatorialCoordinates.DecPatternStyleMap, decStyle);
        if (!tuple.match) throw 's';
        var dec = AngleParser.matchToAngle(tuple);

        return new EquatorialCoordinates(ra, dec);      
    }
}