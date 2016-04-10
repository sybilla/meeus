define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (AngleStyle) {
        AngleStyle[AngleStyle["Hour"] = 0] = "Hour";
        AngleStyle[AngleStyle["Degree"] = 1] = "Degree";
        AngleStyle[AngleStyle["Radian"] = 2] = "Radian";
    })(exports.AngleStyle || (exports.AngleStyle = {}));
    var AngleStyle = exports.AngleStyle;
    ;
    (function (AngleNormalization) {
        AngleNormalization[AngleNormalization["Reflective"] = 0] = "Reflective";
        AngleNormalization[AngleNormalization["Periodic"] = 1] = "Periodic";
    })(exports.AngleNormalization || (exports.AngleNormalization = {}));
    var AngleNormalization = exports.AngleNormalization;
    ;
    var AngleParser = (function () {
        function AngleParser() {
        }
        AngleParser.parse = function (s, patternStyleMap, style) {
            return AngleParser.matchToAngle(AngleParser.match(s, patternStyleMap, style));
        };
        AngleParser.match = function (s, patternStyleMap, style) {
            if (s != null) {
                s = s.trim();
            }
            var outTuple = null;
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
        };
        AngleParser.matchToAngle = function (match) {
            var first = parseFloat(match.match[2]);
            if (isNaN(first))
                first = 0;
            var second = parseFloat(match.match[4]);
            if (isNaN(second))
                second = 0;
            var third = parseFloat(match.match[6]);
            if (isNaN(third))
                third = 0;
            var angle;
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
            if (match.match[1] === '-')
                angle = angle.negative();
            return angle;
        };
        AngleParser.RegexPatterns = [
            'd ([+-])?(\\d{1,3}):( )?(\\d{1,2}):?( )?(\\d{1,2}([\\.,]\\d+)?)?',
            '([+-])?(\\d{1,3}):( )?(\\d{1,2}):?( )?(\\d{1,2}([\\.,]\\d+)?)?',
            'd ([+-])?(\\d{1,3})( )(\\d{1,2})( )?(\\d{1,2}([\\.,]\\d+)?)?',
            '([+-])?(\\d{1,3})( )(\\d{1,2})( )?(\\d{1,2}([\\.,]\\d+)?)?',
            '([+-])?(\\d{1,3})h( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)?[s]?',
            '([+-])?(\\d{1,3})d( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)?[s]?',
            '([+-])?(\\d{1,3})[°*]( )?(\\d{1,2})\\\'( )?(\\d{1,2}([\.,]\\d+)?)?[\\"]?',
            '([a-zA-Z])(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)',
            '([+-])?(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)?',
            'd ([+-])?(\\d{1,3}([\\.,]\\d+)?)',
            '([+-])?(\\d{1,3}([\\.,]\\d+)?)',
        ];
        AngleParser.RegexPatternStyleMap = {
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
            10: AngleStyle.Radian,
        };
        return AngleParser;
    }());
    exports.AngleParser = AngleParser;
    var Angle = (function () {
        function Angle(degrees) {
            this._dms = degrees * Angle.DegreeMillisecondsInDegree;
        }
        Object.defineProperty(Angle.prototype, "hours", {
            get: function () {
                return this._dms / (Angle.DegreeMillisecondsInMillisecond * Angle.DegreeMillisecondsInDegree);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hour", {
            get: function () {
                return (0 | this.hours);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourMinutes", {
            get: function () {
                return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourMinute", {
            get: function () {
                return (0 | this.hourMinutes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourSeconds", {
            get: function () {
                return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourSecond", {
            get: function () {
                return (0 | this.hourSeconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourMilliseconds", {
            get: function () {
                return (0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeSecond;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "hourMillisecond", {
            get: function () {
                return (0 | this.hourMilliseconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degrees", {
            get: function () {
                return this._dms / Angle.DegreeMillisecondsInDegree;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degree", {
            get: function () {
                return (0 | this.degrees);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeMinutes", {
            get: function () {
                return ((0 | this._dms) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeMinute", {
            get: function () {
                return (0 | this.degreeMinutes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeSeconds", {
            get: function () {
                return ((0 | this._dms) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeSecond", {
            get: function () {
                return (0 | this.degreeSeconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeMilliseconds", {
            get: function () {
                return this._dms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "degreeMillisecond", {
            get: function () {
                return (0 | this.degreeMilliseconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Angle.prototype, "radians", {
            get: function () {
                return this.degrees * Math.PI / 180;
            },
            enumerable: true,
            configurable: true
        });
        Angle.prototype.addHours = function (hours) {
            return Angle.fromHours(this.hours + hours);
        };
        Angle.prototype.addHourMinutes = function (minutes) {
            return Angle.fromHours(this.hours, minutes);
        };
        Angle.prototype.addHourSeconds = function (seconds) {
            return Angle.fromHours(this.hours, 0, seconds);
        };
        Angle.prototype.addHourMilliseconds = function (milliseconds) {
            return Angle.fromHours(this.hours, 0, 0, milliseconds);
        };
        Angle.prototype.addDegrees = function (degrees) {
            return Angle.fromDegrees(this.degrees + degrees);
        };
        Angle.prototype.addDegreeMinutes = function (minutes) {
            return Angle.fromDegrees(this.degrees, minutes);
        };
        Angle.prototype.addDegreeSeconds = function (seconds) {
            return Angle.fromDegrees(this.degrees, 0, seconds);
        };
        Angle.prototype.addDegreeMilliseconds = function (milliseconds) {
            return Angle.fromDegrees(this.degrees, 0, 0, milliseconds);
        };
        Angle.prototype.toFormattedString = function (config) {
            config = config || {};
            var digits = 1;
            var format = 'D';
            var t = typeof (config);
            if (t === 'string') {
                format = config;
            }
            else if (t === 'number') {
                digits = config;
            }
            else {
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
        };
        Angle.prototype.negative = function () {
            return Angle.fromDegrees(0, 0, 0, -this._dms);
        };
        Angle.prototype.normalize = function (lowerBound, normalization) {
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
        };
        Angle.prototype.__normalizeReflective = function (lowerBound) {
            var range = 180;
            var upperBound = lowerBound + range;
            var d = this.__normalizeInternal(lowerBound - 90);
            if (d < lowerBound) {
                d = lowerBound + Math.min(Math.abs(d - lowerBound), Math.abs(d + lowerBound));
            }
            else if (d >= upperBound) {
                d = upperBound - Math.min(Math.abs(d - upperBound), Math.abs(d + upperBound));
            }
            return Angle.fromDegrees(d);
        };
        Angle.prototype.__normalizePeriodic = function (lowerBound) {
            return Angle.fromDegrees(this.__normalizeInternal(lowerBound));
        };
        Angle.prototype.__normalizeInternal = function (lowerBound) {
            var range = 360;
            var d = this.degrees;
            var i = ((d - lowerBound) / range);
            if (i < 0)
                i -= 1;
            d -= (0 | i) * range;
            return d;
        };
        Angle.fromDegrees = function (degrees, degreeMinutes, degreeSeconds, degreeMilliseconds) {
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
        };
        Angle.fromHours = function (hours, hourMinutes, hourSeconds, hourMilliseconds) {
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
        };
        Angle.fromRadians = function (radians) {
            radians = radians || 0;
            return Angle.fromDegrees(radians * 180 / Math.PI);
        };
        Angle.parse = function (s, style) {
            return AngleParser.parse(s, AngleParser.RegexPatternStyleMap, style);
        };
        Angle.absPad = function (val, fixed) {
            fixed = fixed || 0;
            //            console.log('fixed = ' + fixed);
            var str = ((val < 10 && val > -10) ? '0' : '') + ((fixed > 0)
                ? Math.abs(val).toFixed(fixed + 1)
                : Math.abs(val).toFixed(fixed));
            if (fixed > 0)
                str = str.substr(0, fixed + 3);
            return str;
        };
        Angle.DegreeMillisecondsInDegree = 3600000;
        Angle.DegreeMillisecondsInDegreeMinute = 60000;
        Angle.DegreeMillisecondsInDegreeSecond = 1000;
        Angle.DegreeMillisecondsInMillisecond = 15;
        return Angle;
    }());
    exports.Angle = Angle;
});
//# sourceMappingURL=angle.js.map