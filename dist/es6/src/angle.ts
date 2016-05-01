export enum AngleStyle { Hour, Degree, Radian };

export enum AngleNormalization { Reflective, Periodic };

export class AngleParser {

    static RegexPatterns: Array<any> = [
        /*  0 */"^d ([+-])?(\\d{1,3}):( )?(\\d{1,2}):( )?(\\d{1,2}([\\.,]\\d+)?)",
        /*  1 */"^([+-])?(\\d{1,3}):( )?(\\d{1,2}):( )?(\\d{1,2}([\\.,]\\d+)?)",
        /*  2 */"^d ([+-])?(\\d{1,3})() (\\d{1,2})() (\\d{1,2}([\\.,]\\d+)?)",
        /*  3 */"^([+-])?(\\d{1,3})() (\\d{1,2})() (\\d{1,2}([\\.,]\\d+)?)",
        /*  4 */"^([+-])?(\\d{1,3})h( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)[s]?",
        /*  5 */"^([+-])?(\\d{1,3})d( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)[s]?",
        /*  6 */"^([+-])?(\\d{1,3})[°*]( )?(\\d{1,2})'( )?(\\d{1,2}([\\.,]\\d+)?)[\"]?",
        /*  7 */"^([a-zA-Z])(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)",
        /*  8 */"^([+-])?(\\d{2})()(\\d{2}[\\.,]\\d+)",
        /*  9 */"^([+-])?(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)",
        /* 10 */"^[d][ ]([+-])?(\\d{1,3}([\\.\\,]\\d+)?)",
        /* 11 */"^([+-])?(\\d{1,3}([\\.,]\\d+)?)"
        // 'd ([+-])?(\\d{1,3}):( )?(\\d{1,2}):?( )?(\\d{1,2}([\\.,]\\d+)?)?',
        // '([+-])?(\\d{1,3}):( )?(\\d{1,2}):?( )?(\\d{1,2}([\\.,]\\d+)?)?',
        // 'd ([+-])?(\\d{1,3})( )(\\d{1,2})( )?(\\d{1,2}([\\.,]\\d+)?)?',
        // '([+-])?(\\d{1,3})( )(\\d{1,2})( )?(\\d{1,2}([\\.,]\\d+)?)?',
        // '([+-])?(\\d{1,3})h( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)?[s]?',
        // '([+-])?(\\d{1,3})d( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)?[s]?',
        // '([+-])?(\\d{1,3})[°*]( )?(\\d{1,2})\\\'( )?(\\d{1,2}([\.,]\\d+)?)?[\\"]?',
        // '([a-zA-Z])(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)',
        // '([+-])?(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)?',
        // 'd ([+-])?(\\d{1,3}([\\.,]\\d+)?)',
        // '([+-])?(\\d{1,3}([\\.,]\\d+)?)',
    ];

    static RegexPatternStyleMap: any = {
        0: AngleStyle.Degree,
        1: AngleStyle.Degree,
        2: AngleStyle.Degree,
        3: AngleStyle.Degree,
        4: AngleStyle.Hour,
        5: AngleStyle.Degree,
        6: AngleStyle.Degree,
        7: AngleStyle.Hour,
        8: AngleStyle.Degree,
        9: AngleStyle.Degree,
        10: AngleStyle.Degree,
        11: AngleStyle.Radian,
    };

    // TODO: make negative angle parsing exact
    static parse(s: string, patternStyleMap: any, style?: AngleStyle): Angle {
        return AngleParser.matchToAngle(AngleParser.match(s, patternStyleMap, style));
    }

    static match(s: string, patternStyleMap: any, style?: AngleStyle): any {
        if (s != null) {
            s = s.trim().replace(/^[^(0-9|a-zA-Z|\-)]/, '');
        }

        var outTuple: any = null;

        for (var i = 0; i < AngleParser.RegexPatterns.length; i++) {
            var r = new RegExp(AngleParser.RegexPatterns[i], 'g');
            var match = r.exec(s);

            if (match != null) {
                if (style === undefined) {
                    var d_style = patternStyleMap[i];
                    style = (d_style !== undefined) ? d_style : AngleParser.RegexPatternStyleMap[i];
                }

                outTuple = { match: match, style: style };
                break;
            }
        }

        if (outTuple == null) {
            throw 's';
        }

        return outTuple;
    }

    static matchToAngle(match: any): Angle {

        var tmp = match.match[2];
        if (tmp) tmp = tmp.replace(',', '.');

        var first: number = parseFloat(tmp);
        if (isNaN(first)) first = 0;

        var tmp = match.match[4];
        if (tmp) tmp = tmp.replace(',', '.');

        var second: number = parseFloat(tmp);
        if (isNaN(second)) second = 0;

        var tmp = match.match[6];
        if (tmp) tmp = tmp.replace(',', '.');

        var third: number = parseFloat(tmp);
        if (isNaN(third)) third = 0;

        var angle: Angle;

        switch (match.style) {
            case AngleStyle.Hour:
                angle = Angle.fromHours(first, second, third);
                break;
            case AngleStyle.Degree:
                angle = Angle.fromDegrees(first, second, third);
                break;
            case AngleStyle.Radian:
                angle = Angle.fromRadians(first);
                break;
            default:
                throw 'style';
        }

        if (match.match[1] === '-') {
          angle = angle.negative();
        }

        return angle;
    }
}

export class Angle {
    public static DegreeMillisecondsInDegree: number = 3600000;
    public static DegreeMillisecondsInDegreeMinute: number = 60000;
    public static DegreeMillisecondsInDegreeSecond: number = 1000;
    public static DegreeMillisecondsInMillisecond: number = 15;

    private _dms: number;

    constructor(degrees) {
        this._dms = degrees * Angle.DegreeMillisecondsInDegree;
    }

    get hours(): number {
        return this._dms / (Angle.DegreeMillisecondsInMillisecond * Angle.DegreeMillisecondsInDegree);
    }

    get hour(): number {
        return (0 | this.hours);
    }

    get hourMinutes(): number {
        return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
    }

    get hourMinute(): number {
        return (0 | this.hourMinutes);
    }

    get hourSeconds(): number {
        return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
    }

    get hourSecond(): number {
        return (0 | this.hourSeconds);
    }

    get hourMilliseconds(): number {
        return (0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeSecond;
    }

    get hourMillisecond(): number {
        return (0 | this.hourMilliseconds);
    }

    get degrees(): number {
        return this._dms / Angle.DegreeMillisecondsInDegree;
    }

    get degree(): number {
        return (0 | this.degrees);
    }

    get degreeMinutes(): number {
        return ((0 | this._dms) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
    }

    get degreeMinute(): number {
        return (0 | this.degreeMinutes);
    }

    get degreeSeconds(): number {
        return ((0 | this._dms) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
    }

    get degreeSecond(): number {
        return (0 | this.degreeSeconds);
    }

    get degreeMilliseconds(): number {
        return this._dms;
    }

    get degreeMillisecond(): number {
        return (0 | this.degreeMilliseconds);
    }

    get radians(): number {
        return this.degrees * Math.PI / 180;
    }

    addHours(hours: number): Angle {
        return Angle.fromHours(this.hours + hours);
    }

    addHourMinutes(minutes: number): Angle {
        return Angle.fromHours(this.hours, minutes);
    }

    addHourSeconds(seconds: number): Angle {
        return Angle.fromHours(this.hours, 0, seconds);
    }

    addHourMilliseconds(milliseconds: number): Angle {
        return Angle.fromHours(this.hours, 0, 0, milliseconds);
    }

    addDegrees(degrees: number): Angle {
        return Angle.fromDegrees(this.degrees + degrees);
    }

    addDegreeMinutes(minutes: number): Angle {
        return Angle.fromDegrees(this.degrees, minutes);
    }

    addDegreeSeconds(seconds: number): Angle {
        return Angle.fromDegrees(this.degrees, 0, seconds);
    }

    addDegreeMilliseconds(milliseconds: number): Angle {
        return Angle.fromDegrees(this.degrees, 0, 0, milliseconds);
    }

    toFormattedString(config: any): string {
        config = config || {};
        var digits: number = 1;
        var format = 'D';
        var t = typeof (config);
        if (t === 'string') {
            format = config;
        } else if (t === 'number') {
            digits = config;
        } else {
            config.format = config.format || format;
            config.digits = (config.digits != null ? config.digits : digits);

            format = config.format;
            digits = config.digits;
        }

        switch (format) {
            case "H":
                var hs = this.hourSeconds;
                var hm = this.hourMinute;
                var hh = this.hour;

                var hs_str = Angle.absPad(hs, digits);
                hs = parseFloat(hs_str);
                if (hs >= 60) {
                    hs -= 60;
                    hm += 1;
                }

                if (hm >= 60) {
                    hm -= 60;
                    hh += 1;
                }

                if (hh >= 24) {
                    hh -= 24;
                }

                return hh + 'h' + Angle.absPad(hm) + 'm' + Angle.absPad(hs, digits) + 's';
            case "D":
                var s = this._dms < 0 ? '-' : '';
                var ds = this.degreeSeconds;
                var dm = this.degreeMinute;
                var dd = this.degree;

                var ds_str = Angle.absPad(ds, digits);
                ds = parseFloat(ds_str);
                if (ds >= 60) {
                    ds -= 60;
                    dm += 1;
                }

                if (dm >= 60) {
                    dm -= 60;
                    dd += 1;
                }

                if (dd >= 360) {
                    dd -= 360;
                }

                return s + Math.abs(dd) + '\u00B0' + Angle.absPad(dm) + '\'' + Angle.absPad(ds, digits) + '"';
            case "R":
                return this.radians.toFixed(2).toString();
            default:
                return '';
        }
    }

    negative(): Angle {
        return Angle.fromDegrees(0, 0, 0, -this._dms);
    }

    normalize(lowerBound?: number, normalization?: AngleNormalization): Angle {
        lowerBound = lowerBound || 0;
        normalization = (normalization === undefined) ? AngleNormalization.Periodic : normalization;
        switch (normalization) {
            case AngleNormalization.Reflective:
                return this.__normalizeReflective(lowerBound);
            case AngleNormalization.Periodic:
                return this.__normalizePeriodic(lowerBound);
            default:
                throw 'normalization';
        }
    }

    private __normalizeReflective(lowerBound: number): Angle {
        var range: number = 180;
        var upperBound: number = lowerBound + range;

        var d = this.__normalizeInternal(lowerBound - 90);

        if (d < lowerBound) {
            d = lowerBound + Math.min(Math.abs(d - lowerBound), Math.abs(d + lowerBound));
        }
        else if (d >= upperBound) {
            d = upperBound - Math.min(Math.abs(d - upperBound), Math.abs(d + upperBound));
        }

        return Angle.fromDegrees(d);
    }

    private __normalizePeriodic(lowerBound: number): Angle {
        return Angle.fromDegrees(this.__normalizeInternal(lowerBound));
    }

    private __normalizeInternal(lowerBound: number): number {
        var range: number = 360;
        var d: number = this.degrees;
        var i: number = ((d - lowerBound) / range);
        if (i < 0) i -= 1;
        d -= (0 | i) * range;

        return d;
    }

    static fromDegrees(degrees?: number, degreeMinutes?: number, degreeSeconds?: number, degreeMilliseconds?: number): Angle {
        degrees = degrees || 0;
        degreeMinutes = degreeMinutes || 0;
        degreeSeconds = degreeSeconds || 0;
        degreeMilliseconds = degreeMilliseconds || 0;
        degrees = degrees + degreeMinutes / 60 + degreeSeconds / 3600 + degreeMilliseconds / 3600000;
        
        if (Math.abs(degrees) >= 360) {
            var intDegrees = Math.floor(degrees);
            var restDegrees = degrees - intDegrees;
            intDegrees %= 360;
            degrees = intDegrees + restDegrees;
        }

        return new Angle(degrees);
    }

    static fromHours(hours?: number, hourMinutes?: number, hourSeconds?: number, hourMilliseconds?: number): Angle {
        hours = hours || 0;
        hourMinutes = hourMinutes || 0;
        hourSeconds = hourSeconds || 0;
        hourMilliseconds = hourMilliseconds || 0;

        hours = hours + hourMinutes / 60 + hourSeconds / 3600 + hourMilliseconds / 3600000;

        if (Math.abs(hours) >= 24) {
            var inthours = Math.floor(hours);
            var resthours = hours - inthours;
            inthours %= 24;
            hours = inthours + resthours;
        }
        return new Angle(hours * Angle.DegreeMillisecondsInMillisecond);
    }

    static fromRadians(radians?: number): Angle {
        radians = radians || 0;
        return Angle.fromDegrees(radians * 180 / Math.PI)
    }

    static parse(s: string, style?: AngleStyle) {
        return AngleParser.parse(s, AngleParser.RegexPatternStyleMap, style);
    }

    private static absPad(val: number, fixed?: number) {
        fixed = fixed || 0;
        //            console.log('fixed = ' + fixed);
        var str = ((val < 10 && val > -10) ? '0' : '') + ((fixed > 0)
            ? Math.abs(val).toFixed(fixed + 1)
            : Math.abs(val).toFixed(fixed));
        if (fixed > 0) str = str.substr(0, fixed + 3);
        return str;
    }
}