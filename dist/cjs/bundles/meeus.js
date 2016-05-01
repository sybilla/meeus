/**
  @license
  This is a repository for meeus, a library for astrometric computations in JavaScript by Sybilla Technologies, sp. z o.o.

The library is available under different licenses depending on whether it is intended for commercial/government use, or for a personal or non-profit project.

- Commercial/governmnent: please contact us via info@sybillatechnologies.com
- Personal or non-profit: MIT (https://opensource.org/licenses/MIT)
 **/
"format register";
System.register("sybilla/angle", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  (function(AngleStyle) {
    AngleStyle[AngleStyle["Hour"] = 0] = "Hour";
    AngleStyle[AngleStyle["Degree"] = 1] = "Degree";
    AngleStyle[AngleStyle["Radian"] = 2] = "Radian";
  })(exports.AngleStyle || (exports.AngleStyle = {}));
  var AngleStyle = exports.AngleStyle;
  ;
  (function(AngleNormalization) {
    AngleNormalization[AngleNormalization["Reflective"] = 0] = "Reflective";
    AngleNormalization[AngleNormalization["Periodic"] = 1] = "Periodic";
  })(exports.AngleNormalization || (exports.AngleNormalization = {}));
  var AngleNormalization = exports.AngleNormalization;
  ;
  var AngleParser = (function() {
    function AngleParser() {}
    AngleParser.parse = function(s, patternStyleMap, style) {
      return AngleParser.matchToAngle(AngleParser.match(s, patternStyleMap, style));
    };
    AngleParser.match = function(s, patternStyleMap, style) {
      if (s != null) {
        s = s.trim().replace(/^[^(0-9|a-zA-Z|\-)]/, '');
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
          outTuple = {
            match: match,
            style: style
          };
          break;
        }
      }
      if (outTuple == null) {
        throw 's';
      }
      return outTuple;
    };
    AngleParser.matchToAngle = function(match) {
      var tmp = match.match[2];
      if (tmp)
        tmp = tmp.replace(',', '.');
      var first = parseFloat(tmp);
      if (isNaN(first))
        first = 0;
      var tmp = match.match[4];
      if (tmp)
        tmp = tmp.replace(',', '.');
      var second = parseFloat(tmp);
      if (isNaN(second))
        second = 0;
      var tmp = match.match[6];
      if (tmp)
        tmp = tmp.replace(',', '.');
      var third = parseFloat(tmp);
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
      if (match.match[1] === '-') {
        angle = angle.negative();
      }
      return angle;
    };
    AngleParser.RegexPatterns = ["^d ([+-])?(\\d{1,3}):( )?(\\d{1,2}):( )?(\\d{1,2}([\\.,]\\d+)?)", "^([+-])?(\\d{1,3}):( )?(\\d{1,2}):( )?(\\d{1,2}([\\.,]\\d+)?)", "^d ([+-])?(\\d{1,3})() (\\d{1,2})() (\\d{1,2}([\\.,]\\d+)?)", "^([+-])?(\\d{1,3})() (\\d{1,2})() (\\d{1,2}([\\.,]\\d+)?)", "^([+-])?(\\d{1,3})h( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)[s]?", "^([+-])?(\\d{1,3})d( )?(\\d{1,2})m( )?(\\d{1,2}([\\.,]\\d+)?)[s]?", "^([+-])?(\\d{1,3})[°*]( )?(\\d{1,2})'( )?(\\d{1,2}([\\.,]\\d+)?)[\"]?", "^([a-zA-Z])(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)", "^([+-])?(\\d{2})()(\\d{2}[\\.,]\\d+)", "^([+-])?(\\d{2})()(\\d{2})()(\\d{2}([\\.,]\\d+)?)", "^[d][ ]([+-])?(\\d{1,3}([\\.\\,]\\d+)?)", "^([+-])?(\\d{1,3}([\\.,]\\d+)?)"];
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
      10: AngleStyle.Degree,
      11: AngleStyle.Radian
    };
    return AngleParser;
  }());
  exports.AngleParser = AngleParser;
  var Angle = (function() {
    function Angle(degrees) {
      this._dms = degrees * Angle.DegreeMillisecondsInDegree;
    }
    Object.defineProperty(Angle.prototype, "hours", {
      get: function() {
        return this._dms / (Angle.DegreeMillisecondsInMillisecond * Angle.DegreeMillisecondsInDegree);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hour", {
      get: function() {
        return (0 | this.hours);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourMinutes", {
      get: function() {
        return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourMinute", {
      get: function() {
        return (0 | this.hourMinutes);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourSeconds", {
      get: function() {
        return ((0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourSecond", {
      get: function() {
        return (0 | this.hourSeconds);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourMilliseconds", {
      get: function() {
        return (0 | (this._dms / Angle.DegreeMillisecondsInMillisecond)) % Angle.DegreeMillisecondsInDegreeSecond;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "hourMillisecond", {
      get: function() {
        return (0 | this.hourMilliseconds);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degrees", {
      get: function() {
        return this._dms / Angle.DegreeMillisecondsInDegree;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degree", {
      get: function() {
        return (0 | this.degrees);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeMinutes", {
      get: function() {
        return ((0 | this._dms) % Angle.DegreeMillisecondsInDegree) / Angle.DegreeMillisecondsInDegreeMinute;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeMinute", {
      get: function() {
        return (0 | this.degreeMinutes);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeSeconds", {
      get: function() {
        return ((0 | this._dms) % Angle.DegreeMillisecondsInDegreeMinute) / Angle.DegreeMillisecondsInDegreeSecond;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeSecond", {
      get: function() {
        return (0 | this.degreeSeconds);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeMilliseconds", {
      get: function() {
        return this._dms;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "degreeMillisecond", {
      get: function() {
        return (0 | this.degreeMilliseconds);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Angle.prototype, "radians", {
      get: function() {
        return this.degrees * Math.PI / 180;
      },
      enumerable: true,
      configurable: true
    });
    Angle.prototype.addHours = function(hours) {
      return Angle.fromHours(this.hours + hours);
    };
    Angle.prototype.addHourMinutes = function(minutes) {
      return Angle.fromHours(this.hours, minutes);
    };
    Angle.prototype.addHourSeconds = function(seconds) {
      return Angle.fromHours(this.hours, 0, seconds);
    };
    Angle.prototype.addHourMilliseconds = function(milliseconds) {
      return Angle.fromHours(this.hours, 0, 0, milliseconds);
    };
    Angle.prototype.addDegrees = function(degrees) {
      return Angle.fromDegrees(this.degrees + degrees);
    };
    Angle.prototype.addDegreeMinutes = function(minutes) {
      return Angle.fromDegrees(this.degrees, minutes);
    };
    Angle.prototype.addDegreeSeconds = function(seconds) {
      return Angle.fromDegrees(this.degrees, 0, seconds);
    };
    Angle.prototype.addDegreeMilliseconds = function(milliseconds) {
      return Angle.fromDegrees(this.degrees, 0, 0, milliseconds);
    };
    Angle.prototype.toFormattedString = function(config) {
      config = config || {};
      var digits = 1;
      var format = 'D';
      var t = typeof(config);
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
    };
    Angle.prototype.negative = function() {
      return Angle.fromDegrees(0, 0, 0, -this._dms);
    };
    Angle.prototype.normalize = function(lowerBound, normalization) {
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
    Angle.prototype.__normalizeReflective = function(lowerBound) {
      var range = 180;
      var upperBound = lowerBound + range;
      var d = this.__normalizeInternal(lowerBound - 90);
      if (d < lowerBound) {
        d = lowerBound + Math.min(Math.abs(d - lowerBound), Math.abs(d + lowerBound));
      } else if (d >= upperBound) {
        d = upperBound - Math.min(Math.abs(d - upperBound), Math.abs(d + upperBound));
      }
      return Angle.fromDegrees(d);
    };
    Angle.prototype.__normalizePeriodic = function(lowerBound) {
      return Angle.fromDegrees(this.__normalizeInternal(lowerBound));
    };
    Angle.prototype.__normalizeInternal = function(lowerBound) {
      var range = 360;
      var d = this.degrees;
      var i = ((d - lowerBound) / range);
      if (i < 0)
        i -= 1;
      d -= (0 | i) * range;
      return d;
    };
    Angle.fromDegrees = function(degrees, degreeMinutes, degreeSeconds, degreeMilliseconds) {
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
    Angle.fromHours = function(hours, hourMinutes, hourSeconds, hourMilliseconds) {
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
    Angle.fromRadians = function(radians) {
      radians = radians || 0;
      return Angle.fromDegrees(radians * 180 / Math.PI);
    };
    Angle.parse = function(s, style) {
      return AngleParser.parse(s, AngleParser.RegexPatternStyleMap, style);
    };
    Angle.absPad = function(val, fixed) {
      fixed = fixed || 0;
      var str = ((val < 10 && val > -10) ? '0' : '') + ((fixed > 0) ? Math.abs(val).toFixed(fixed + 1) : Math.abs(val).toFixed(fixed));
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
  global.define = __define;
  return module.exports;
});

System.register("sybilla/datetime/hjddate", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var HjdDate = (function() {
    function HjdDate(days) {
      this._days = days;
    }
    Object.defineProperty(HjdDate.prototype, "days", {
      get: function() {
        return this._days;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HjdDate.prototype, "daysSinceJ2000", {
      get: function() {
        return this._days - 2451545.0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HjdDate.prototype, "centuriesSinceJ2000", {
      get: function() {
        return this.daysSinceJ2000 / 36525.0;
      },
      enumerable: true,
      configurable: true
    });
    HjdDate.prototype.addDays = function(days) {
      return new HjdDate(this.days + days);
    };
    HjdDate.prototype.addHours = function(hours) {
      return new HjdDate(this.days + hours / 24);
    };
    HjdDate.prototype.addMinutes = function(minutes) {
      return new HjdDate(this.days + minutes / 1440);
    };
    HjdDate.prototype.addSeconds = function(seconds) {
      return new HjdDate(this.days + seconds / 86400);
    };
    HjdDate.prototype.addMilliseconds = function(milliseconds) {
      return new HjdDate(this.days + milliseconds / 86400000);
    };
    return HjdDate;
  }());
  exports.HjdDate = HjdDate;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/datetime/ttdate", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var TtDate = (function() {
    function TtDate(days) {
      this._days = days;
    }
    Object.defineProperty(TtDate.prototype, "days", {
      get: function() {
        return this._days;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TtDate.prototype, "daysSinceJ2000", {
      get: function() {
        return this._days - 2451545.0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TtDate.prototype, "centuriesSinceJ2000", {
      get: function() {
        return this.daysSinceJ2000 / 36525.0;
      },
      enumerable: true,
      configurable: true
    });
    TtDate.prototype.addDays = function(days) {
      return new TtDate(this.days + days);
    };
    TtDate.prototype.addHours = function(hours) {
      return new TtDate(this.days + hours / 24);
    };
    TtDate.prototype.addMinutes = function(minutes) {
      return new TtDate(this.days + minutes / 1440);
    };
    TtDate.prototype.addSeconds = function(seconds) {
      return new TtDate(this.days + seconds / 86400);
    };
    TtDate.prototype.addMilliseconds = function(milliseconds) {
      return new TtDate(this.days + milliseconds / 86400000);
    };
    return TtDate;
  }());
  exports.TtDate = TtDate;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/datetime/siderealtimes", ["sybilla/datetime/utcdate"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var utcdate_1 = require("sybilla/datetime/utcdate");
  var __BaseTime = (function() {
    function __BaseTime(hours) {
      this._hours = hours;
    }
    Object.defineProperty(__BaseTime.prototype, "hours", {
      get: function() {
        return this._hours;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "hour", {
      get: function() {
        return (0 | this._hours);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "minutes", {
      get: function() {
        return (this.hours - this.hour) * 60;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "minute", {
      get: function() {
        return (0 | this.minutes);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "seconds", {
      get: function() {
        return (this.minutes - this.minute) * 60;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "second", {
      get: function() {
        return (0 | this.seconds);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "milliseconds", {
      get: function() {
        return (this.seconds - this.second) * 1000;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__BaseTime.prototype, "millisecond", {
      get: function() {
        return (0 | this.milliseconds);
      },
      enumerable: true,
      configurable: true
    });
    __BaseTime.prototype.toFormattedString = function() {
      var seconds = Math.round(this.seconds);
      var minutes = Math.round(this.minute);
      var hour = this.hour;
      if (seconds == 60) {
        minutes += 1;
        seconds = 0;
      }
      if (minutes >= 60) {
        hour += 1;
        minutes -= 60;
      }
      return hour + ':' + __BaseTime.absPad(minutes) + ':' + __BaseTime.absPad(seconds);
    };
    __BaseTime.absPad = function(val, fixed) {
      var fixedValue = Math.abs(val).toFixed(fixed || 0);
      var fixedNumber = parseFloat(fixedValue);
      return ((fixedNumber < 10 && fixedNumber > -10) ? '0' : '') + fixedValue;
    };
    return __BaseTime;
  }());
  exports.__BaseTime = __BaseTime;
  var GmsTime = (function(_super) {
    __extends(GmsTime, _super);
    function GmsTime() {
      _super.apply(this, arguments);
    }
    GmsTime.fromDate = function(date) {
      return utcdate_1.UtcDate.fromDate(date).toGmsTime();
    };
    return GmsTime;
  }(__BaseTime));
  exports.GmsTime = GmsTime;
  var LmsTime = (function(_super) {
    __extends(LmsTime, _super);
    function LmsTime() {
      _super.apply(this, arguments);
    }
    return LmsTime;
  }(__BaseTime));
  exports.LmsTime = LmsTime;
  var GasTime = (function(_super) {
    __extends(GasTime, _super);
    function GasTime() {
      _super.apply(this, arguments);
    }
    GasTime.fromDate = function(date) {
      return utcdate_1.UtcDate.fromDate(date).toGasTime();
    };
    return GasTime;
  }(__BaseTime));
  exports.GasTime = GasTime;
  var LasTime = (function(_super) {
    __extends(LasTime, _super);
    function LasTime() {
      _super.apply(this, arguments);
    }
    return LasTime;
  }(__BaseTime));
  exports.LasTime = LasTime;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/datetime/taidate", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var TaiDate = (function() {
    function TaiDate(days) {
      this._days = days;
    }
    Object.defineProperty(TaiDate.prototype, "days", {
      get: function() {
        return this._days;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TaiDate.prototype, "daysSinceJ2000", {
      get: function() {
        return this._days - 2451545.0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TaiDate.prototype, "centuriesSinceJ2000", {
      get: function() {
        return this.daysSinceJ2000 / 36525.0;
      },
      enumerable: true,
      configurable: true
    });
    TaiDate.prototype.addDays = function(days) {
      return new TaiDate(this.days + days);
    };
    TaiDate.prototype.addHours = function(hours) {
      return new TaiDate(this.days + hours / 24);
    };
    TaiDate.prototype.addMinutes = function(minutes) {
      return new TaiDate(this.days + minutes / 1440);
    };
    TaiDate.prototype.addSeconds = function(seconds) {
      return new TaiDate(this.days + seconds / 86400);
    };
    TaiDate.prototype.addMilliseconds = function(milliseconds) {
      return new TaiDate(this.days + milliseconds / 86400000);
    };
    return TaiDate;
  }());
  exports.TaiDate = TaiDate;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/coordinateSystems/geographicCoordinates", ["sybilla/angle", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var angle_1 = require("sybilla/angle");
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var GeographicCoordinates = (function() {
    function GeographicCoordinates(latitude, longitude, altitude) {
      this.latitude = latitude;
      this.longitude = longitude;
      this._alt = altitude || 0;
    }
    Object.defineProperty(GeographicCoordinates.prototype, "latitude", {
      get: function() {
        return this._lat;
      },
      set: function(val) {
        this._lat = val.normalize(-90, angle_1.AngleNormalization.Reflective);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(GeographicCoordinates.prototype, "longitude", {
      get: function() {
        return this._lon;
      },
      set: function(val) {
        this._lon = val.normalize(-180);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(GeographicCoordinates.prototype, "altitude", {
      get: function() {
        return this._alt;
      },
      enumerable: true,
      configurable: true
    });
    GeographicCoordinates.prototype.sunrise = function(date, twilight) {
      return meeusEngine_1.MeeusEngine.getSunriseAt(this, date, twilight);
    };
    GeographicCoordinates.prototype.sunset = function(date, twilight) {
      return meeusEngine_1.MeeusEngine.getSunsetAt(this, date, twilight);
    };
    GeographicCoordinates.prototype.toFormattedString = function(config) {
      config = config || {};
      if (config.digits == null)
        config.digits = 1;
      return this.latitude.toFormattedString({
        format: 'D',
        digits: config.digits
      }) + ' ' + this.longitude.toFormattedString({
        format: 'D',
        digits: config.digits
      }) + ' ' + this.altitude;
    };
    GeographicCoordinates.parse = function(s, latStyle, lonStyle) {
      var tuple = angle_1.AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, latStyle);
      if (!tuple.match)
        throw 's';
      var lat = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
      tuple = angle_1.AngleParser.match(s, GeographicCoordinates.RegexPatternStyleMap, lonStyle);
      if (!tuple.match)
        throw 's';
      var lon = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
      var alt = parseFloat(s);
      if (isNaN(alt))
        alt = 0;
      return new GeographicCoordinates(lat, lon, alt);
    };
    GeographicCoordinates.RegexPatternStyleMap = {
      7: angle_1.AngleStyle.Degree,
      11: angle_1.AngleStyle.Degree
    };
    return GeographicCoordinates;
  }());
  exports.GeographicCoordinates = GeographicCoordinates;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/coordinateSystems/equatorialCoordinates", ["sybilla/angle", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var angle_1 = require("sybilla/angle");
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var EquatorialCoordinates = (function() {
    function EquatorialCoordinates(rightAscension, declination) {
      this.rightAscension = rightAscension;
      this.declination = declination;
    }
    Object.defineProperty(EquatorialCoordinates.prototype, "rightAscension", {
      get: function() {
        return this._ra;
      },
      set: function(val) {
        this._ra = val.normalize();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(EquatorialCoordinates.prototype, "declination", {
      get: function() {
        return this._dec;
      },
      set: function(val) {
        this._dec = val.normalize(-90, angle_1.AngleNormalization.Reflective);
      },
      enumerable: true,
      configurable: true
    });
    EquatorialCoordinates.prototype.toHorizontalCoordinates = function(date, location) {
      return meeusEngine_1.MeeusEngine.toHorizontalCoordinates(this, date, location);
    };
    EquatorialCoordinates.prototype.toFormattedString = function(config) {
      config = config || {};
      if (config.digits == null)
        config.digits = 1;
      return this.rightAscension.toFormattedString({
        format: 'H',
        digits: config.digits
      }) + ' ' + this.declination.toFormattedString({
        format: 'D',
        digits: config.digits
      });
    };
    EquatorialCoordinates.parse = function(s, raStyle, decStyle) {
      var tuple = angle_1.AngleParser.match(s, EquatorialCoordinates.RaPatternStyleMap, raStyle);
      if (!tuple.match)
        throw 's';
      var ra = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
      tuple = angle_1.AngleParser.match(s, EquatorialCoordinates.DecPatternStyleMap, decStyle);
      if (!tuple.match)
        throw 's';
      var dec = angle_1.AngleParser.matchToAngle(tuple);
      return new EquatorialCoordinates(ra, dec);
    };
    EquatorialCoordinates.RaPatternStyleMap = {
      1: angle_1.AngleStyle.Hour,
      3: angle_1.AngleStyle.Hour,
      8: angle_1.AngleStyle.Hour,
      9: angle_1.AngleStyle.Hour,
      11: angle_1.AngleStyle.Hour
    };
    EquatorialCoordinates.DecPatternStyleMap = {
      7: angle_1.AngleStyle.Degree,
      11: angle_1.AngleStyle.Degree
    };
    return EquatorialCoordinates;
  }());
  exports.EquatorialCoordinates = EquatorialCoordinates;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/coordinateSystems/horizontalCoordinates", ["sybilla/angle", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var angle_1 = require("sybilla/angle");
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var HorizontalCoordinates = (function() {
    function HorizontalCoordinates(altitude, azimuth) {
      this.altitude = altitude;
      this.azimuth = azimuth;
    }
    Object.defineProperty(HorizontalCoordinates.prototype, "altitude", {
      get: function() {
        return this._alt;
      },
      set: function(val) {
        this._alt = val.normalize(-90, angle_1.AngleNormalization.Reflective);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HorizontalCoordinates.prototype, "azimuth", {
      get: function() {
        return this._az;
      },
      set: function(val) {
        this._az = val.normalize();
      },
      enumerable: true,
      configurable: true
    });
    HorizontalCoordinates.prototype.toEquatorialCoordinates = function(date, location) {
      return meeusEngine_1.MeeusEngine.toEquatorialCoordinates(this, date, location);
    };
    HorizontalCoordinates.prototype.toFormattedString = function(config) {
      config = config || {};
      if (config.digits == null)
        config.digits = 1;
      return this.altitude.toFormattedString({
        format: 'D',
        digits: config.digits
      }) + ' ' + this.azimuth.toFormattedString({
        format: 'D',
        digits: config.digits
      });
    };
    HorizontalCoordinates.parse = function(s, altStyle, azStyle) {
      var tuple = angle_1.AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, altStyle);
      if (!tuple.match)
        throw 's';
      var alt = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
      tuple = angle_1.AngleParser.match(s, HorizontalCoordinates.RegexPatternStyleMap, azStyle);
      if (!tuple.match)
        throw 's';
      var az = angle_1.AngleParser.matchToAngle(tuple);
      return new HorizontalCoordinates(alt, az);
    };
    HorizontalCoordinates.RegexPatternStyleMap = {
      7: angle_1.AngleStyle.Degree,
      11: angle_1.AngleStyle.Degree
    };
    return HorizontalCoordinates;
  }());
  exports.HorizontalCoordinates = HorizontalCoordinates;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/solarSystem/earth", ["sybilla/core/meeusEngine", "sybilla/datetime/utcdate"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var utcdate_1 = require("sybilla/datetime/utcdate");
  var Earth = (function() {
    function Earth() {}
    Earth.orbitalEccentricity = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.earthCartesianPositionAt(utc);
    };
    Earth.cartesianPositionAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.earthCartesianPositionAt(utc);
    };
    Earth.cartesianVelocityAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.earthCartesianVelocityAt(utc);
    };
    return Earth;
  }());
  exports.Earth = Earth;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/solarSystem/sun", ["sybilla/datetime/utcdate", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var utcdate_1 = require("sybilla/datetime/utcdate");
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var Sun = (function() {
    function Sun() {}
    Sun.positionAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.sunPositionAt(utc);
    };
    return Sun;
  }());
  exports.Sun = Sun;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/coordinateSystems/eclipticCoordinates", ["sybilla/angle"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var angle_1 = require("sybilla/angle");
  var EclipticCoordinates = (function() {
    function EclipticCoordinates(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
    Object.defineProperty(EclipticCoordinates.prototype, "latitude", {
      get: function() {
        return this._lat;
      },
      set: function(val) {
        this._lat = val.normalize(-90, angle_1.AngleNormalization.Reflective);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(EclipticCoordinates.prototype, "longitude", {
      get: function() {
        return this._lon;
      },
      set: function(val) {
        this._lon = val.normalize(-180);
      },
      enumerable: true,
      configurable: true
    });
    EclipticCoordinates.prototype.toFormattedString = function(config) {
      config = config || {};
      if (config.digits == null)
        config.digits = 1;
      return this.latitude.toFormattedString({
        format: 'D',
        digits: config.digits
      }) + ' ' + this.longitude.toFormattedString({
        format: 'D',
        digits: config.digits
      });
    };
    EclipticCoordinates.parse = function(s, latStyle, lonStyle) {
      var tuple = angle_1.AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, latStyle);
      if (!tuple.match)
        throw 's';
      var lat = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length);
      tuple = angle_1.AngleParser.match(s, EclipticCoordinates.RegexPatternStyleMap, lonStyle);
      if (!tuple.match)
        throw 's';
      var lon = angle_1.AngleParser.matchToAngle(tuple);
      s = s.substr(s.indexOf(tuple.match[0]) + tuple.match[0].length).trim();
      return new EclipticCoordinates(lat, lon);
    };
    EclipticCoordinates.RegexPatternStyleMap = {
      7: angle_1.AngleStyle.Degree,
      11: angle_1.AngleStyle.Degree
    };
    return EclipticCoordinates;
  }());
  exports.EclipticCoordinates = EclipticCoordinates;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/core/meeusEngine", ["sybilla/angle", "sybilla/datetime/utcdate", "sybilla/datetime/hjddate", "sybilla/datetime/ttdate", "sybilla/datetime/siderealtimes", "sybilla/datetime/taidate", "sybilla/coordinateSystems/geographicCoordinates", "sybilla/coordinateSystems/equatorialCoordinates", "sybilla/coordinateSystems/horizontalCoordinates"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var angle_1 = require("sybilla/angle");
  var utcdate_1 = require("sybilla/datetime/utcdate");
  var hjddate_1 = require("sybilla/datetime/hjddate");
  var ttdate_1 = require("sybilla/datetime/ttdate");
  var siderealtimes_1 = require("sybilla/datetime/siderealtimes");
  var taidate_1 = require("sybilla/datetime/taidate");
  var geographicCoordinates_1 = require("sybilla/coordinateSystems/geographicCoordinates");
  var equatorialCoordinates_1 = require("sybilla/coordinateSystems/equatorialCoordinates");
  var horizontalCoordinates_1 = require("sybilla/coordinateSystems/horizontalCoordinates");
  (function(Twilight) {
    Twilight[Twilight["Official"] = 0] = "Official";
    Twilight[Twilight["Astronomical"] = 1] = "Astronomical";
    Twilight[Twilight["Nautical"] = 2] = "Nautical";
    Twilight[Twilight["Civil"] = 3] = "Civil";
  })(exports.Twilight || (exports.Twilight = {}));
  var Twilight = exports.Twilight;
  ;
  var MeeusEngine = (function() {
    function MeeusEngine() {}
    MeeusEngine.getLeapSeconds = function(days) {
      var taiutc = null;
      for (var idx = 0; idx < MeeusEngine.LeapSeconds.length; idx++) {
        var tmp = MeeusEngine.LeapSeconds[idx];
        if (tmp.utcdays < days) {
          taiutc = tmp.taiutc;
          break;
        }
      }
      if (taiutc == null)
        throw 'days';
      return taiutc.p1 + (days - 2400000.5 - taiutc.p2) * taiutc.p3;
    };
    MeeusEngine.toTaiDate = function(date) {
      var diffSeconds = MeeusEngine.getLeapSeconds(date.days);
      return new taidate_1.TaiDate(date.days + diffSeconds / 86400);
    };
    MeeusEngine.toTtDate = function(date) {
      var diffSeconds = MeeusEngine.getLeapSeconds(date.days) + MeeusEngine.TaiToTtOffsetSeconds;
      return new ttdate_1.TtDate(date.days + diffSeconds / 86400);
    };
    MeeusEngine.toGmsTime = function(date) {
      var jd = date.daysSinceJ2000;
      var jt = jd / 36525.0;
      var jt2 = jt * jt;
      var jt3 = jt2 * jt;
      var st = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jt2 - jt3 / 38710000;
      return new siderealtimes_1.GmsTime(MeeusEngine.normalize(st) / 15.0);
    };
    MeeusEngine.toLmsTime = function(date, location) {
      var longitude = location;
      if (longitude instanceof angle_1.Angle)
        longitude = longitude.degrees;
      else if (longitude instanceof geographicCoordinates_1.GeographicCoordinates)
        longitude = longitude.longitude.degrees;
      var jd = date.daysSinceJ2000;
      var jt = jd / 36525.0;
      var jt2 = jt * jt;
      var jt3 = jt2 * jt;
      var st = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jt2 - jt3 / 38710000 + longitude;
      return new siderealtimes_1.LmsTime(MeeusEngine.normalize(st) / 15.0);
    };
    MeeusEngine.toGasTime = function(date) {
      return new siderealtimes_1.GasTime(MeeusEngine.toGasDegrees(date) / 15.0);
    };
    MeeusEngine.toLasTime = function(date, location) {
      var longitude = location;
      if (longitude instanceof angle_1.Angle)
        longitude = longitude.degrees;
      else if (longitude instanceof geographicCoordinates_1.GeographicCoordinates)
        longitude = longitude.longitude.degrees;
      var st = MeeusEngine.toGasDegrees(date);
      st = st + longitude;
      return new siderealtimes_1.LasTime(MeeusEngine.normalize(st) / 15);
    };
    MeeusEngine.toHjdDate = function(date, location, position) {
      var earthPos = MeeusEngine.earthPositionAt(date);
      var ePos = MeeusEngine.equatorialToCartesian(earthPos);
      var oPos = MeeusEngine.equatorialToCartesian(position);
      var corr = MeeusEngine.MinsPerAU * (ePos.x * oPos.x + ePos.y * oPos.y + ePos.z * oPos.z);
      return new hjddate_1.HjdDate(date.days).addMinutes(corr);
    };
    MeeusEngine.getSunriseAt = function(location, date, twilight) {
      return MeeusEngine.calc_SunriseOrSunset(true, MeeusEngine.prepareJd(date || new Date()), location, twilight || Twilight.Official);
    };
    MeeusEngine.getSunsetAt = function(location, date, twilight) {
      return MeeusEngine.calc_SunriseOrSunset(false, MeeusEngine.prepareJd(date || new Date()), location, twilight || Twilight.Official);
    };
    MeeusEngine.sunPositionAt = function(date) {
      var params = MeeusEngine.preparePositionalParameters(date.centuriesSinceJ2000);
      var stl = params.sun.trueLongitude;
      var emo = params.ecliptic.meanObliquity;
      var raDeg = MeeusEngine.datan2(MeeusEngine.dsin(stl) * MeeusEngine.dcos(emo) - MeeusEngine.dtan(0) * MeeusEngine.dsin(emo), MeeusEngine.dcos(stl));
      var decDeg = MeeusEngine.dasin(MeeusEngine.dsin(0) * MeeusEngine.dcos(emo) + MeeusEngine.dcos(0) * MeeusEngine.dsin(emo) * MeeusEngine.dsin(stl));
      return new equatorialCoordinates_1.EquatorialCoordinates(angle_1.Angle.fromDegrees(raDeg), angle_1.Angle.fromDegrees(decDeg));
    };
    MeeusEngine.earthPositionAt = function(date) {
      var params = MeeusEngine.preparePositionalParameters(date.centuriesSinceJ2000);
      var stl = params.sun.trueLongitude;
      var emo = params.ecliptic.meanObliquity;
      var raDeg = MeeusEngine.datan2(MeeusEngine.dsin(stl) * MeeusEngine.dcos(emo) - MeeusEngine.dtan(0) * MeeusEngine.dsin(emo), MeeusEngine.dcos(stl));
      var decDeg = MeeusEngine.dasin(MeeusEngine.dsin(0) * MeeusEngine.dcos(emo) + MeeusEngine.dcos(0) * MeeusEngine.dsin(emo) * MeeusEngine.dsin(stl));
      raDeg += 180;
      if (raDeg > 360)
        raDeg -= 360;
      decDeg *= -1;
      return new equatorialCoordinates_1.EquatorialCoordinates(angle_1.Angle.fromDegrees(raDeg), angle_1.Angle.fromDegrees(decDeg));
    };
    MeeusEngine.moonPositionAt = function(date) {
      var jt = date.centuriesSinceJ2000;
      var jt2 = jt * jt;
      var jt3 = jt2 * jt;
      var params = MeeusEngine.preparePositionalParameters(jt);
      var sed = params.sun.earthDistance;
      var sma = params.sun.meanAnomaly;
      var emo = params.ecliptic.meanObliquity;
      var sal = params.sun.apparentLongitude;
      var mal = MeeusEngine.calc_Moon_ArgumentOfLatitude(jt, jt2, jt3);
      var mml = MeeusEngine.calc_Moon_MeanLongitude(jt);
      var lan = MeeusEngine.calc_Moon_LongitudeAscendingNode(jt, jt2, jt3);
      var mma = MeeusEngine.calc_Moon_MeanAnomaly(jt, jt2, jt3);
      var mme = MeeusEngine.calc_Moon_MeanElongation(jt, jt2, jt3);
      var me2 = 2 * mme;
      var med = MeeusEngine.calc_Moon_Earth_Distance(mma, mme);
      var msr = MeeusEngine.calc_Moon_Sun_DistanceRatio(med, sed);
      var geo_lat = MeeusEngine.calc_Moon_GeocentricLatitude(mal, mma, mme);
      var geo_lon = MeeusEngine.calc_Moon_GeocentricLongitude(mma, mme, mml, mal, sma);
      var raDeg = MeeusEngine.datan2(MeeusEngine.dsin(geo_lon) * MeeusEngine.dcos(emo) - MeeusEngine.dtan(geo_lat) * MeeusEngine.dsin(emo), MeeusEngine.dcos(geo_lon));
      var decDeg = MeeusEngine.dasin(MeeusEngine.dsin(geo_lat) * MeeusEngine.dcos(emo) + MeeusEngine.dcos(geo_lat) * MeeusEngine.dsin(emo) * MeeusEngine.dsin(geo_lon));
      return new equatorialCoordinates_1.EquatorialCoordinates(angle_1.Angle.fromDegrees(raDeg), angle_1.Angle.fromDegrees(decDeg));
    };
    MeeusEngine.getAngularSeparation = function(ob1, ob2) {
      var o1ra = ob1.rightAscension.radians;
      var o1dec = ob1.declination.radians;
      var o2ra = ob2.rightAscension.radians;
      var o2dec = ob2.declination.radians;
      var y = Math.sqrt(((Math.cos(o2dec) * Math.sin(o1ra - o2ra))) * ((Math.cos(o2dec) * Math.sin(o1ra - o2ra))) + ((Math.cos(o1dec) * Math.sin(o2dec) - Math.cos(o2dec) * Math.sin(o1dec) * Math.cos(o1ra - o2ra))) * ((Math.cos(o1dec) * Math.sin(o2dec) - Math.cos(o2dec) * Math.sin(o1dec) * Math.cos(o1ra - o2ra))));
      var x = Math.sin(o1dec) * Math.sin(o2dec) + Math.cos(o1dec) * Math.cos(o2dec) * Math.cos(o1ra - o2ra);
      var angularSeparation = Math.atan2(y, x) * MeeusEngine.R2D;
      return angle_1.Angle.fromDegrees(angularSeparation);
    };
    MeeusEngine.toHorizontalCoordinates = function(ec, date, location) {
      var utc;
      var mst;
      if (date instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      else if (date instanceof utcdate_1.UtcDate)
        utc = date;
      var ecAtUtc = MeeusEngine.fromJ2000(ec, utc);
      mst = MeeusEngine.toLasTime(utc, location.longitude.degrees);
      var ha = angle_1.Angle.fromHours(mst.hours - ecAtUtc.rightAscension.hours).normalize();
      var haRad = ha.radians;
      var decRad = ecAtUtc.declination.radians;
      var latRad = location.latitude.radians;
      var sinAltRad = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
      var altRad = Math.asin(sinAltRad);
      var cosAzRad = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (Math.cos(altRad) * Math.cos(latRad));
      var azRad = Math.acos(cosAzRad);
      var h_alt = altRad * MeeusEngine.R2D;
      var h_az = azRad * MeeusEngine.R2D;
      if (Math.sin(haRad) > 0)
        h_az = 360 - h_az;
      return new horizontalCoordinates_1.HorizontalCoordinates(MeeusEngine.toTopocentric(h_alt), angle_1.Angle.fromDegrees(h_az));
    };
    MeeusEngine.toEquatorialCoordinates = function(position, date, location) {
      var utc;
      if (date instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      else if (date instanceof utcdate_1.UtcDate)
        utc = date;
      var a = position.azimuth.degrees + 180;
      if (a >= 360)
        a -= 360;
      var aRad = a * MeeusEngine.D2R;
      var latRad = location.latitude.radians;
      var altRad = MeeusEngine.toGeocentric(position.altitude).radians;
      var localHourAngle = angle_1.Angle.fromRadians(Math.atan2(Math.sin(aRad), Math.cos(aRad) * Math.sin(latRad) + Math.tan(altRad) * Math.cos(latRad)));
      var mst = utc.toLasTime(location.longitude.degrees);
      var rightAscenstion = angle_1.Angle.fromHours(mst.hours - localHourAngle.hours).normalize();
      var sinDeclination = Math.sin(latRad) * Math.sin(altRad) - Math.cos(latRad) * Math.cos(altRad) * Math.cos(aRad);
      if (sinDeclination < -1 || sinDeclination > 1)
        throw 'Illegal value: ' + sinDeclination + ', should be in [-1,1].';
      var declination = Math.asin(sinDeclination);
      return MeeusEngine.toJ2000(new equatorialCoordinates_1.EquatorialCoordinates(rightAscenstion, angle_1.Angle.fromRadians(declination)), utc);
    };
    MeeusEngine.dsin = function(x) {
      return Math.sin(MeeusEngine.D2R * x);
    };
    MeeusEngine.dcos = function(x) {
      return Math.cos(MeeusEngine.D2R * x);
    };
    MeeusEngine.dtan = function(x) {
      return Math.tan(MeeusEngine.D2R * x);
    };
    MeeusEngine.dasin = function(x) {
      return MeeusEngine.R2D * Math.asin(x);
    };
    MeeusEngine.dacos = function(x) {
      return MeeusEngine.R2D * Math.acos(x);
    };
    MeeusEngine.datan = function(x) {
      return MeeusEngine.R2D * Math.atan(x);
    };
    MeeusEngine.datan2 = function(y, x) {
      var a;
      if ((x == 0) && (y == 0)) {
        return 0;
      } else {
        a = MeeusEngine.datan(y / x);
        if (x < 0) {
          a = a + 180;
        }
        if (y < 0 && x > 0) {
          a = a + 360;
        }
        return a;
      }
    };
    MeeusEngine.normalize = function(x) {
      return x - (360.0 * Math.floor(x / 360.0));
    };
    MeeusEngine.addCartesian = function(o1, o2) {
      return {
        x: o1.x + o2.x,
        y: o1.y + o2.y,
        z: o1.z + o2.z
      };
    };
    MeeusEngine.equatorialToCartesian = function(position) {
      var raRad = position.rightAscension.radians;
      var decRad = position.declination.radians;
      var c = Math.cos(decRad);
      var x = Math.cos(raRad) * c;
      var y = Math.sin(raRad) * c;
      var z = Math.sin(decRad);
      return {
        x: x,
        y: y,
        z: z
      };
    };
    MeeusEngine.geographicToCartesian = function(location, date) {
      var gas = date.toGasTime();
      var n = 0.99664719 * 0.99664719;
      var latDeg = 0.017453292519943295 * location.latitude.degrees;
      var _sinLat = Math.sin(latDeg);
      var _cosLat = Math.cos(latDeg);
      var n5 = 1.0 / Math.sqrt(Math.pow(_cosLat, 2) + n * Math.pow(_sinLat, 2));
      var n6 = n * n5;
      var alt = location.altitude / 1000;
      var theta1Alt = 6378.14 * n5 + alt;
      var theta2Alt = 6378.14 * n6 + alt;
      var lonDeg = location.longitude.degrees;
      var n9 = (gas.hours * 15 + lonDeg) * 0.017453292519943295;
      var _sinLon = Math.sin(n9);
      var _cosLon = Math.cos(n9);
      return {
        x: theta1Alt * _cosLat * _cosLon / 149597870.0,
        y: theta1Alt * _cosLat * _sinLon / 149597870.0,
        z: theta2Alt * _sinLat / 149597870.0
      };
    };
    MeeusEngine.preparePositionalParameters = function(jt) {
      var sml = MeeusEngine.calc_Sun_MeanLongitude(jt);
      var sma = MeeusEngine.calc_Sun_MeanAnomaly(jt);
      var sec = MeeusEngine.calc_Sun_EqOfCenter(jt, sma);
      var sta = MeeusEngine.calc_Sun_TrueAnomaly(jt, sma, sec);
      var ecc = MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      var stl = MeeusEngine.calc_Sun_TrueLong(jt, sml, sec);
      var sla = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt);
      var sal = MeeusEngine.calc_Sun_ApparentLong(jt, stl, sla);
      var emo = MeeusEngine.calc_Ecliptic_MeanObliquity(jt);
      var sed = MeeusEngine.calc_Sun_Earth_Distance(jt, ecc, sma, sec, sta);
      return {
        sun: {
          trueLongitude: stl,
          apparentLongitude: sal,
          earthDistance: sed,
          meanAnomaly: sma
        },
        ecliptic: {meanObliquity: emo}
      };
    };
    MeeusEngine.calc_Earth_OrbitEccentricity = function(jt) {
      return 0.016708634 - jt * (0.000042037 + 0.0000001267 * jt);
    };
    MeeusEngine.earthCartesianPositionAt = function(date) {
      var p1 = MeeusEngine.earthPositionAt(date);
      return MeeusEngine.equatorialToCartesian(p1);
    };
    MeeusEngine.earthCartesianVelocityAt = function(date) {
      var p1 = MeeusEngine.earthPositionAt(date);
      var p0 = MeeusEngine.earthPositionAt(date.addMinutes(-1));
      var c1 = MeeusEngine.equatorialToCartesian(p1);
      var c0 = MeeusEngine.equatorialToCartesian(p0);
      return {
        x: (c1.x - c0.x) / 0.000704,
        y: (c1.y - c0.y) / 0.000704,
        z: (c1.z - c0.z) / 0.000704
      };
    };
    MeeusEngine.convertToHeliocentric = function(location, date) {
      var p = MeeusEngine.earthCartesianPositionAt(date);
      var geo_location = MeeusEngine.geographicToCartesian(location, date);
      var helio_location = {
        x: p.x + geo_location.x,
        y: p.y + geo_location.y,
        z: p.z + geo_location.z
      };
      return helio_location;
    };
    MeeusEngine.calc_Ecliptic_MeanObliquity = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt2 * jt;
      return (21.448 / 60 + 26) / 60 + 23 + (-46.815 * jt - 0.00059 * jt2 + 0.001813 * jt3) / 3600;
    };
    MeeusEngine.calc_Ecliptic_ObliquityCorrection = function(jt, eclipticMeanObliquity) {
      var e0 = eclipticMeanObliquity || MeeusEngine.calc_Ecliptic_MeanObliquity(jt);
      var omega = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt);
      return e0 + 0.00256 * Math.cos(MeeusEngine.D2R * omega);
    };
    MeeusEngine.calc_Sun_Earth_Distance = function(jt, earthEcc, sunMeanAnomaly, sunEqOfCenter, sunTrueAnomaly) {
      earthEcc = earthEcc || MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      sunMeanAnomaly = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
      sunEqOfCenter = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt, sunMeanAnomaly);
      sunTrueAnomaly = sunTrueAnomaly || MeeusEngine.calc_Sun_TrueAnomaly(jt, sunMeanAnomaly, sunEqOfCenter);
      return 0.99972 / (1 + earthEcc * MeeusEngine.dcos(sunTrueAnomaly));
    };
    MeeusEngine.calc_Sun_MeanLongitude = function(jt) {
      return MeeusEngine.normalize(280.46646 + jt * (36000.76983 + jt * 0.0003032));
    };
    MeeusEngine.calc_Sun_MeanAnomaly = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt * jt2;
      return MeeusEngine.normalize(357.52772 + 35999.05034 * jt - 0.0001603 * jt2 - jt3 / 300000);
    };
    MeeusEngine.calc_Sun_EqOfCenter = function(jt, sunMeanAnomaly) {
      var sma = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
      var mrad = MeeusEngine.D2R * sma;
      var sinm = Math.sin(mrad);
      var sin2m = Math.sin(mrad + mrad);
      var sin3m = Math.sin(mrad + mrad + mrad);
      return sinm * (1.914602 - jt * (0.004817 + 0.000014 * jt)) + sin2m * (0.019993 - 0.000101 * jt) + sin3m * 0.000289;
    };
    MeeusEngine.calc_Sun_TrueLong = function(jt, sunMeanLongitude, sunEqOfCenter) {
      var sml = sunMeanLongitude || MeeusEngine.calc_Sun_MeanLongitude(jt);
      var sec = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt);
      return sml + sec;
    };
    MeeusEngine.calc_Sun_TrueAnomaly = function(jt, sunMeanAnomaly, sunEqOfCenter) {
      var sma = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
      var sec = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt);
      return sma + sec;
    };
    MeeusEngine.calcSunRadVector = function(jt, sunTrueAnomaly, earthOrbitEcc) {
      var sta = sunTrueAnomaly || MeeusEngine.calc_Sun_TrueAnomaly(jt);
      var ecc = earthOrbitEcc || MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      var R_AU = (1.000001018 * (1 - ecc * ecc)) / (1 + ecc * Math.cos(MeeusEngine.D2R * sta));
      return R_AU;
    };
    MeeusEngine.calc_Sun_LongitudeOfAscendingNode = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt2 * jt;
      return MeeusEngine.normalize(125.04452 - 1934.136261 * jt + 0.0020708 * jt2 + jt3 / 450000);
    };
    MeeusEngine.calc_Sun_ApparentLong = function(jt, sunTrueLong, sunLongOfAscNode) {
      var stl = sunTrueLong || MeeusEngine.calc_Sun_TrueLong(jt);
      var sunLongOfAscNode = sunLongOfAscNode || MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt);
      return stl - 0.00569 - 0.00478 * Math.sin(MeeusEngine.D2R * sunLongOfAscNode);
    };
    MeeusEngine.calc_Moon_MeanAnomaly = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt2 * jt;
      return MeeusEngine.normalize(134.96298 + 477198.867398 * jt + 0.0086972 * jt2 + jt3 / 56250);
    };
    MeeusEngine.calc_Moon_MeanElongation = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt2 * jt;
      return MeeusEngine.normalize(297.85036 + 445267.11148 * jt - 0.0019142 * jt2 + jt3 / 189474);
    };
    MeeusEngine.calc_Moon_MeanLongitude = function(jt) {
      return MeeusEngine.normalize(218.316 + 481267.8813 * jt);
    };
    MeeusEngine.calc_Moon_LongitudeAscendingNode = function(jt, jt2, jt3) {
      return MeeusEngine.normalize(125.045 - 1934.14 * jt + 0.002071 * jt2 + jt3 / 450000);
    };
    MeeusEngine.calc_Moon_Earth_Distance = function(moonMeanAnomaly, moonMeanElongation) {
      var mme2 = moonMeanElongation * 2;
      return 1 + (-20954 * MeeusEngine.dcos(moonMeanAnomaly) - 3699 * MeeusEngine.dcos(mme2 - moonMeanAnomaly) - 2956 * MeeusEngine.dcos(moonMeanAnomaly)) / 385000;
    };
    MeeusEngine.calc_Moon_Sun_DistanceRatio = function(moonEarthDistance, sunEarthDistance) {
      return (moonEarthDistance / sunEarthDistance) / 379.168831168831;
    };
    MeeusEngine.calc_Moon_GeocentricLatitude = function(moonArgOfLatitude, moonMeanAnomaly, moonMeanElongation) {
      var me2 = moonMeanElongation * 2;
      var geo_lat = 5.128 * MeeusEngine.dsin(moonArgOfLatitude) + 0.2806 * MeeusEngine.dsin(moonMeanAnomaly + moonArgOfLatitude);
      geo_lat = geo_lat + 0.2777 * MeeusEngine.dsin(moonMeanAnomaly - moonArgOfLatitude) + 0.1732 * MeeusEngine.dsin(me2 - moonArgOfLatitude);
      return geo_lat;
    };
    MeeusEngine.calc_Moon_GeocentricLongitude = function(moonMeanAnomaly, moonMeanElongation, moonMeanLongitude, moonArgumentOfLatitude, sunMeanAnomaly) {
      var mma = moonMeanAnomaly;
      var me2 = moonMeanElongation * 2;
      var mal = moonArgumentOfLatitude;
      var sma = sunMeanAnomaly;
      var mml = moonMeanLongitude;
      var geo_lon = 6.289 * MeeusEngine.dsin(mma) + 1.274 * MeeusEngine.dsin(me2 - mma) + 0.6583 * MeeusEngine.dsin(me2);
      geo_lon = geo_lon + 0.2136 * MeeusEngine.dsin(2 * mma) - 0.1851 * MeeusEngine.dsin(sma) - 0.1143 * MeeusEngine.dsin(2 * mal);
      geo_lon = geo_lon + 0.0588 * MeeusEngine.dsin(me2 - 2 * mma);
      geo_lon = geo_lon + 0.0572 * MeeusEngine.dsin(me2 - sma - mma) + 0.0533 * MeeusEngine.dsin(me2 + mma);
      geo_lon = geo_lon + mml;
      return geo_lon;
    };
    MeeusEngine.calc_Moon_HeliocentricLatitude = function(moonSunDistanceRatio, moonGeocentricLatitude) {
      return moonSunDistanceRatio * moonGeocentricLatitude;
    };
    MeeusEngine.calc_Moon_HeliocentricLongitude = function(sunApparentLongitude, moonSunDistanceRatio, moonHeliocentricLatitude, moonGeocentricLongitude) {
      return MeeusEngine.normalize(sunApparentLongitude + 180 + (180 / Math.PI) * moonSunDistanceRatio * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dsin(sunApparentLongitude - moonGeocentricLongitude));
    };
    MeeusEngine.calc_Moon_ArgumentOfLatitude = function(jt, jt2, jt3) {
      jt2 = jt2 || jt * jt;
      jt3 = jt3 || jt2 * jt;
      return MeeusEngine.normalize(93.27191 + 483202.017538 * jt - 0.0036825 * jt2 + jt3 / 327270);
    };
    MeeusEngine.calc_Moon_LongitudeOfTerminator = function(u) {
      var jt = u.centuriesSinceJ2000;
      var jt2 = jt * jt;
      var jt3 = jt * jt2;
      var earthEcc = MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      var sunMeanAnomaly = MeeusEngine.calc_Sun_MeanAnomaly(jt, jt2, jt3);
      var sunEquationOfCenter = MeeusEngine.calc_Sun_EqOfCenter(jt, sunMeanAnomaly);
      var sunTrueAnomaly = MeeusEngine.calc_Sun_TrueAnomaly(jt, sunMeanAnomaly, sunEquationOfCenter);
      var sunEarthDistance = MeeusEngine.calc_Sun_Earth_Distance(jt, earthEcc, sunMeanAnomaly, sunEquationOfCenter, sunTrueAnomaly);
      var sunLongitudeOfAscNode = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt, jt2, jt3);
      var sunMeanLongitude = MeeusEngine.calc_Sun_MeanLongitude(jt);
      var sunTrueLongitude = MeeusEngine.calc_Sun_TrueLong(jt, sunMeanLongitude, sunEquationOfCenter);
      var sunApparentLongitude = MeeusEngine.calc_Sun_ApparentLong(jt, sunTrueLongitude, sunLongitudeOfAscNode);
      var moonMeanAnomaly = MeeusEngine.calc_Moon_MeanAnomaly(jt, jt2, jt3);
      var moonMeanElongation = MeeusEngine.calc_Moon_MeanElongation(jt, jt2, jt3);
      var moonEarthDistance = MeeusEngine.calc_Moon_Earth_Distance(moonMeanAnomaly, moonMeanElongation);
      var moonSunDistanceRatio = MeeusEngine.calc_Moon_Sun_DistanceRatio(moonEarthDistance, sunEarthDistance);
      var moonArgOfLatitude = MeeusEngine.calc_Moon_ArgumentOfLatitude(jt, jt2, jt3);
      var moonGeocentricLatitude = MeeusEngine.calc_Moon_GeocentricLatitude(moonArgOfLatitude, moonMeanAnomaly, moonMeanElongation);
      var moonMeanLongitude = MeeusEngine.calc_Moon_MeanLongitude(jt);
      var moonGeocentricLongitude = MeeusEngine.calc_Moon_GeocentricLongitude(moonMeanAnomaly, moonMeanElongation, moonMeanLongitude, moonArgOfLatitude, sunMeanAnomaly);
      var moonHeliocentricLatitude = MeeusEngine.calc_Moon_HeliocentricLatitude(moonSunDistanceRatio, moonGeocentricLatitude);
      var moonHeliocentricLongitude = MeeusEngine.calc_Moon_HeliocentricLongitude(sunApparentLongitude, moonSunDistanceRatio, moonHeliocentricLatitude, moonGeocentricLongitude);
      var I = 1.54242;
      var W = MeeusEngine.normalize(moonHeliocentricLongitude - sunLongitudeOfAscNode);
      var Y = MeeusEngine.dcos(W) * MeeusEngine.dcos(moonHeliocentricLatitude);
      var X = MeeusEngine.dsin(W) * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dcos(I) - MeeusEngine.dsin(moonHeliocentricLatitude) * MeeusEngine.dsin(I);
      var A = MeeusEngine.datan2(X, Y);
      var SL = MeeusEngine.normalize(A - moonArgOfLatitude);
      var SB = MeeusEngine.dasin(-MeeusEngine.dsin(W) * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dsin(I) - MeeusEngine.dsin(moonHeliocentricLatitude) * MeeusEngine.dcos(I));
      var Co,
          SLt;
      if (SL < 90) {
        Co = 90 - SL;
      } else {
        Co = 450 - SL;
      }
      if ((Co > 90) && (Co < 270)) {
        SLt = 180 - Co;
      } else {
        if (Co < 90) {
          SLt = 0 - Co;
        } else {
          SLt = 360 - Co;
        }
      }
      return angle_1.Angle.fromDegrees(SLt);
    };
    MeeusEngine.calc_Moon_IlluminatedDiscFraction = function(u) {
      var jt = u.centuriesSinceJ2000;
      var jt2 = jt * jt;
      var jt3 = jt * jt2;
      var earthEcc = MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      var sunMeanAnomaly = MeeusEngine.calc_Sun_MeanAnomaly(jt, jt2, jt3);
      var sunEquationOfCenter = MeeusEngine.calc_Sun_EqOfCenter(jt, sunMeanAnomaly);
      var sunTrueAnomaly = MeeusEngine.calc_Sun_TrueAnomaly(jt, sunMeanAnomaly, sunEquationOfCenter);
      var sunEarthDistance = MeeusEngine.calc_Sun_Earth_Distance(jt, earthEcc, sunMeanAnomaly, sunEquationOfCenter, sunTrueAnomaly);
      var sunLongitudeOfAscNode = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt, jt2, jt3);
      var sunMeanLongitude = MeeusEngine.calc_Sun_MeanLongitude(jt);
      var sunTrueLongitude = MeeusEngine.calc_Sun_TrueLong(jt, sunMeanLongitude, sunEquationOfCenter);
      var sunApparentLongitude = MeeusEngine.calc_Sun_ApparentLong(jt, sunTrueLongitude, sunLongitudeOfAscNode);
      var moonMeanAnomaly = MeeusEngine.calc_Moon_MeanAnomaly(jt, jt2, jt3);
      var moonMeanElongation = MeeusEngine.calc_Moon_MeanElongation(jt, jt2, jt3);
      var moonEarthDistance = MeeusEngine.calc_Moon_Earth_Distance(moonMeanAnomaly, moonMeanElongation);
      var moonSunDistanceRatio = MeeusEngine.calc_Moon_Sun_DistanceRatio(moonEarthDistance, sunEarthDistance);
      var moonArgOfLatitude = MeeusEngine.calc_Moon_ArgumentOfLatitude(jt, jt2, jt3);
      var moonGeocentricLatitude = MeeusEngine.calc_Moon_GeocentricLatitude(moonArgOfLatitude, moonMeanAnomaly, moonMeanElongation);
      var moonMeanLongitude = MeeusEngine.calc_Moon_MeanLongitude(jt);
      var moonGeocentricLongitude = MeeusEngine.calc_Moon_GeocentricLongitude(moonMeanAnomaly, moonMeanElongation, moonMeanLongitude, moonArgOfLatitude, sunMeanAnomaly);
      var moonHeliocentricLatitude = MeeusEngine.calc_Moon_HeliocentricLatitude(moonSunDistanceRatio, moonGeocentricLatitude);
      var moonHeliocentricLongitude = MeeusEngine.calc_Moon_HeliocentricLongitude(sunApparentLongitude, moonSunDistanceRatio, moonHeliocentricLatitude, moonGeocentricLongitude);
      var I = 1.54242;
      var W = MeeusEngine.normalize(moonHeliocentricLongitude - sunLongitudeOfAscNode);
      var Y = MeeusEngine.dcos(W) * MeeusEngine.dcos(moonHeliocentricLatitude);
      var X = MeeusEngine.dsin(W) * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dcos(I) - MeeusEngine.dsin(moonHeliocentricLatitude) * MeeusEngine.dsin(I);
      var SL = MeeusEngine.normalize(MeeusEngine.datan2(X, Y) - moonArgOfLatitude);
      var SB = MeeusEngine.dasin(-MeeusEngine.dsin(W) * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dsin(I) - MeeusEngine.dsin(moonHeliocentricLatitude) * MeeusEngine.dcos(I));
      var A = MeeusEngine.dcos(moonGeocentricLatitude) * MeeusEngine.dcos(moonGeocentricLongitude - sunApparentLongitude);
      var Psi = 90 - MeeusEngine.datan(A / Math.sqrt(1 - A * A));
      X = sunEarthDistance * MeeusEngine.dsin(Psi);
      Y = moonSunDistanceRatio - sunEarthDistance * A;
      var Il = MeeusEngine.datan2(X, Y);
      return (1 + MeeusEngine.dcos(Il)) / 2;
    };
    MeeusEngine.calc_Ecliptic_NutationInLongitude = function(jt, sunLongitudeOfAscendinNode, moonMeanElongation, moonArgumentOfLatitude, sunMeanAnomaly, moonMeanAnomaly) {
      var sla = sunLongitudeOfAscendinNode;
      var mme = moonMeanElongation;
      var mal = moonArgumentOfLatitude;
      var sma = sunMeanAnomaly;
      var mma = moonMeanAnomaly;
      var corr = -(171996 + 174.2 * jt) * Math.sin(sla) - (13187 + 1.6 * jt) * Math.sin(-2 * mme + 2 * mal + 2 * sla) - (2274 + 0.2 * jt) * Math.sin(2 * mal + 2 * sla) + (2062 + 0.2 * jt) * Math.sin(2 * sla) + (1426 - 3.4 * jt) * Math.sin(sma) + (712 + 0.1 * jt) * Math.sin(mma);
      corr += (-517 + 1.2 * jt) * Math.sin(-2 * mme + sma + 2 * mal + 2 * sla) - (386 + 0.4 * jt) * Math.sin(2 * mal + sla) - 301 * Math.sin(mma + 2 * mal + 2 * sla) + (217 - 0.5 * jt) * Math.sin(-2 * mme - sma + 2 * mal + 2 * sla) - 158 * Math.sin(-2 * mme + mma);
      corr += (129 + 0.1 * jt) * Math.sin(-2 * mme + 2 * mal + sla) + 123 * Math.sin(-mma + 2 * mal + 2 * sla) + 63 * Math.sin(2 * mme) + (63 + 0.1 * jt) * Math.sin(mma + sla) - 59 * Math.sin(2 * mme - mma + 2 * mal + 2 * sla) - (58 + 0.1 * jt) * Math.sin(-mma + sla);
      corr -= 51 * Math.sin(mma + 2 * mal + sla);
      corr += 48 * Math.sin(-2 * mme + 2 * mma) + 46 * Math.sin(-2 * mma + 2 * mal + sla) - 38 * Math.sin(2 * mme + 2 * mal + 2 * sla) - 31 * Math.sin(2 * mma + 2 * mal + 2 * sla) + 29 * Math.sin(2 * mma) + 29 * Math.sin(-2 * mme + mma + 2 * mal + 2 * sla) + 26 * Math.sin(2 * mal);
      corr -= 22 * Math.sin(2 * mal - 2 * mme) + 21 * Math.sin(2 * mal - mma) + (17 - 0.1 * jt) * Math.sin(2 * sma) + 16 * Math.sin(2 * mme - mma + sla) - (16 - 0.1 * jt) * Math.sin(2 * (sla + mal + sma - mme)) - 15 * Math.sin(sma + sla) - 13 * Math.sin(sla + mma - 2 * mme) - 12 * Math.sin(sla - sma);
      corr += 11 * Math.sin(2 * (mma - mal)) - 10 * Math.sin(2 * mme - mma + 2 * mal) - 8 * Math.sin(2 * mme + mma + 2 * mal + 2 * sla) + 7 * Math.sin(sma + 2 * mal + 2 * sla) - 7 * Math.sin(sma + mma - 2 * mme) - 7 * Math.sin(2 * mal + 2 * sla - sma) - 7 * Math.sin(2 * mme + 2 * mal + sla);
      corr += 6 * Math.sin(2 * mme + mma);
      corr += 6 * Math.sin(2 * (sla + mal + mma - mme)) + 6 * Math.sin(sla + 2 * mal + mma - 2 * mme) - 6 * Math.sin(2 * mme - 2 * mma + sla) - 6 * Math.sin(2 * mme + sla) + 5 * Math.sin(mma - sma) - 5 * Math.sin(sla + 2 * mal - sma - 2 * mme) - 5 * Math.sin(sla - 2 * mme) - 5 * Math.sin(sla + 2 * mal + 2 * mma);
      corr += 4 * Math.sin(sla - 2 * mma - 2 * mme) + 4 * Math.sin(sla + 2 * mal + sma - 2 * mme) + 4 * Math.sin(mma - 2 * mal) - 4 * Math.sin(mma - mme) - 4 * Math.sin(sma - 2 * mme) - 4 * Math.sin(mme) + 3 * Math.sin(2 * mal + mma) - 3 * Math.sin(2 * (sla + mal - mma)) - 3 * Math.sin(mma - sma - mme);
      corr -= 3 * Math.sin(mma + sma);
      corr -= 3 * Math.sin(2 * sla + 2 * mal + mma - sma) - 3 * Math.sin(2 * sla + 2 * mal - mma - sma + 2 * mme) - 3 * Math.sin(2 * sla + 2 * mal + 3 * mma) - 3 * Math.sin(2 * sla + 2 * mal - sma + 2 * mme);
      corr *= 0.0001 / 3600;
      return corr;
    };
    MeeusEngine.calc_Ecliptic_MeanObliquityCorrection = function(jt, jt2, jt3, OMs, Ds, DFs, Ms, M1s) {
      var corr = (92025 + 8.9 * jt) * Math.cos(OMs) + (5736 - 3.1 * jt) * Math.cos(-2 * Ds + 2 * DFs + 2 * OMs) + (977 - 0.5 * jt) * Math.cos(2 * DFs + 2 * OMs) + (-895 + 0.5 * jt) * Math.cos(2 * OMs) + (54 - 0.1 * jt) * Math.cos(Ms) - 7 * Math.cos(M1s);
      corr += (224 - 0.6 * jt) * Math.cos(-2 * Ds + Ms + 2 * DFs + 2 * OMs) + 200 * Math.cos(2 * DFs + OMs) + (129 - 0.1 * jt) * Math.cos(M1s + 2 * DFs + 2 * OMs) + (-95 + 0.3 * jt) * Math.cos(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 70 * Math.cos(-2 * Ds + 2 * DFs + OMs);
      corr -= 53 * Math.cos(-M1s + 2 * DFs + 2 * OMs) - 33 * Math.cos(M1s + OMs) + 26 * Math.cos(2 * Ds - M1s + 2 * DFs + 2 * OMs) + 32 * Math.cos(-M1s + OMs) + 27 * Math.cos(M1s + 2 * DFs + OMs) - 24 * Math.cos(-2 * M1s + 2 * DFs + OMs);
      corr += 16 * Math.cos(2 * (Ds + DFs + OMs)) + 13 * Math.cos(2 * (M1s + DFs + OMs)) - 12 * Math.cos(2 * OMs + 2 * DFs + M1s - 2 * Ds) - 10 * Math.cos(OMs + 2 * DFs - M1s) - 8 * Math.cos(2 * Ds - M1s + OMs) + 7 * Math.cos(2 * (OMs + DFs + Ms - Ds)) + 9 * Math.cos(Ms + OMs);
      corr += 7 * Math.cos(OMs + M1s - 2 * Ds) + 6 * Math.cos(OMs - Ms) + 5 * Math.cos(OMs + 2 * DFs - M1s + 2 * Ds) + 3 * Math.cos(2 * OMs + 2 * DFs + M1s + 2 * Ds) - 3 * Math.cos(2 * OMs + 2 * DFs + Ms) + 3 * Math.cos(2 * OMs + 2 * DFs - Ms) + 3 * Math.cos(OMs + 2 * DFs + 2 * Ds);
      corr -= 3 * Math.cos(2 * (OMs + DFs + M1s - Ds)) - 3 * Math.cos(OMs + 2 * DFs + M1s - 2 * Ds) + 3 * Math.cos(OMs - 2 * M1s + 2 * Ds) + 3 * Math.cos(OMs + 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs - Ms - 2 * Ds) + 3 * Math.cos(OMs - 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs + 2 * M1s);
      corr *= 0.0001 / 3600;
      return corr;
    };
    MeeusEngine.toGasDegrees = function(date) {
      var jd = date.daysSinceJ2000;
      var jt = jd / 36525.0;
      var jt2 = jt * jt;
      var jt3 = jt2 * jt;
      var mme = MeeusEngine.calc_Moon_MeanElongation(jt, jt2, jt3) * MeeusEngine.D2R;
      var sma = MeeusEngine.calc_Sun_MeanAnomaly(jt, jt2, jt3) * MeeusEngine.D2R;
      var mma = MeeusEngine.calc_Moon_MeanAnomaly(jt, jt2, jt3) * MeeusEngine.D2R;
      var mal = MeeusEngine.calc_Moon_ArgumentOfLatitude(jt, jt2, jt3) * MeeusEngine.D2R;
      var lan = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt, jt2, jt3) * MeeusEngine.D2R;
      var nil = MeeusEngine.calc_Ecliptic_NutationInLongitude(jt, lan, mme, mal, sma, mma);
      var emo_corr = MeeusEngine.calc_Ecliptic_MeanObliquity(jt, jt2, jt3) + MeeusEngine.calc_Ecliptic_MeanObliquityCorrection(jt, jt2, jt3, lan, mme, mal, sma, mma);
      var gas = 280.46061837 + (360.98564736629 * jd) + (0.000387933 * jt2) - (jt3 / 38710000);
      gas += nil * Math.cos(emo_corr * MeeusEngine.D2R);
      gas = MeeusEngine.normalize(gas);
      return gas;
    };
    MeeusEngine.correctForRefraction = function(altitude) {
      var true_alt = altitude;
      if (true_alt instanceof angle_1.Angle)
        true_alt = true_alt.degrees;
      var R = 1.0 / Math.tan((true_alt + (7.31 / (true_alt + 4.4))) * MeeusEngine.D2R);
      R -= 0.06 * Math.sin(((14.7 * R / 60.0) + 13.0) * MeeusEngine.D2R);
      R /= 60.0;
      return angle_1.Angle.fromDegrees(true_alt + R);
    };
    MeeusEngine.uncorrectRefraction = function(altitude) {
      var true_alt = altitude;
      if (true_alt instanceof angle_1.Angle)
        true_alt = true_alt.degrees;
      var R = 1.0 / Math.tan((true_alt + (7.31 / (true_alt + 4.4))) * MeeusEngine.D2R);
      R -= 0.06 * Math.sin(((14.7 * R / 60.0) + 13.0) * MeeusEngine.D2R);
      R /= 60.0;
      return true_alt - R;
    };
    MeeusEngine.toTopocentric = function(hc) {
      var alt_geoc = hc;
      if (alt_geoc instanceof angle_1.Angle)
        alt_geoc = alt_geoc.degrees;
      var dist = 1e10;
      var corr = Math.atan(Math.cos(alt_geoc * MeeusEngine.D2R) / (dist - Math.sin(alt_geoc * MeeusEngine.D2R)));
      var alt_topoc = alt_geoc - (corr * MeeusEngine.R2D);
      return MeeusEngine.correctForRefraction(alt_topoc);
    };
    MeeusEngine.toGeocentric = function(hc) {
      var alt_topo = hc;
      if (alt_topo instanceof angle_1.Angle)
        alt_topo = alt_topo.degrees;
      alt_topo = MeeusEngine.uncorrectRefraction(alt_topo);
      var dist = 1e10;
      var corr = Math.atan(Math.cos(alt_topo * MeeusEngine.D2R) / (dist - Math.sin(alt_topo * MeeusEngine.D2R)));
      var alt_geoc = alt_topo + corr * MeeusEngine.R2D;
      return angle_1.Angle.fromDegrees(alt_geoc);
    };
    MeeusEngine.toUnitVector = function(ec) {
      var dec0 = ec.declination.radians;
      var ra0 = ec.rightAscension.radians;
      var res = [];
      res.push(Math.cos(dec0) * Math.cos(ra0));
      res.push(Math.cos(dec0) * Math.sin(ra0));
      res.push(Math.sin(dec0));
      return res;
    };
    MeeusEngine.fromUnitVector = function(uv) {
      var ra = Math.atan2(uv[1], uv[0]);
      var dec = Math.asin(uv[2]);
      return new equatorialCoordinates_1.EquatorialCoordinates(angle_1.Angle.fromRadians(ra), angle_1.Angle.fromRadians(dec));
    };
    MeeusEngine.precesionMatrixParams = function(date) {
      var jt = date.centuriesSinceJ2000;
      var jt2 = jt * jt;
      var jt3 = jt2 * jt;
      var xsi = 0.011180860865024398 * jt + 0.0000014635555405334672 * jt2 + Math.pow(8.725676632609429, -8) * jt3;
      var zeta = 0.011180860865024398 * jt + 0.000005307158404369869 * jt2 + Math.pow(8.825063437236882, -8) * jt3;
      var theta = 0.009717173455169672 * jt + 0.000002068457570453835 * jt2 + Math.pow(2.0281210721855223, -7) * jt3;
      return {
        p00: Math.cos(zeta) * Math.cos(theta) * Math.cos(xsi) - Math.sin(zeta) * Math.sin(xsi),
        p01: -Math.cos(zeta) * Math.cos(theta) * Math.sin(xsi) - Math.sin(zeta) * Math.cos(xsi),
        p02: -Math.cos(zeta) * Math.sin(theta),
        p10: Math.sin(zeta) * Math.cos(theta) * Math.cos(xsi) + Math.cos(zeta) * Math.sin(xsi),
        p11: -Math.sin(zeta) * Math.cos(theta) * Math.sin(xsi) + Math.cos(zeta) * Math.cos(xsi),
        p12: -Math.sin(zeta) * Math.sin(theta),
        p20: Math.sin(theta) * Math.cos(xsi),
        p21: -Math.sin(theta) * Math.sin(xsi),
        p22: Math.cos(theta)
      };
    };
    MeeusEngine.determinant3x3 = function(m) {
      var res = m[0][0] * m[1][1] * m[2][2] - m[0][0] * m[1][2] * m[2][1] - m[0][1] * m[1][0] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1] - m[0][2] * m[1][1] * m[2][0];
      return res;
    };
    MeeusEngine.inverse3x3 = function(m) {
      var det = MeeusEngine.determinant3x3(m);
      return [[(m[1][1] * m[2][2] - m[1][2] * m[2][1]) / det, (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det, (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det], [(m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det, (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det, (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det], [(m[1][0] * m[2][1] - m[1][1] * m[2][0]) / det, (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / det, (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / det]];
    };
    MeeusEngine.inversePrecesionMatrixAt = function(date) {
      var params = MeeusEngine.precesionMatrixParams(date);
      return [[params.p00, params.p10, params.p20], [params.p01, params.p11, params.p21], [params.p02, params.p12, params.p22]];
    };
    MeeusEngine.precesionMatrixAt = function(date) {
      var params = MeeusEngine.precesionMatrixParams(date);
      return [[params.p00, params.p01, params.p02], [params.p10, params.p11, params.p12], [params.p20, params.p21, params.p22]];
    };
    MeeusEngine.matrixTimesMatrix = function(P0, P1) {
      return [[P0[0][0] * P1[0][0] + P0[0][1] * P1[1][0] + P0[0][2] * P1[2][0], P0[0][0] * P1[0][1] + P0[0][1] * P1[1][1] + P0[0][2] * P1[2][1], P0[0][0] * P1[0][2] + P0[0][1] * P1[1][2] + P0[0][2] * P1[2][2]], [P0[1][0] * P1[0][0] + P0[1][1] * P1[1][0] + P0[1][2] * P1[2][0], P0[1][0] * P1[0][1] + P0[1][1] * P1[1][1] + P0[1][2] * P1[2][1], P0[1][0] * P1[0][2] + P0[1][1] * P1[1][2] + P0[1][2] * P1[2][2]], [P0[2][0] * P1[0][0] + P0[2][1] * P1[1][0] + P0[2][2] * P1[2][0], P0[2][0] * P1[0][1] + P0[2][1] * P1[1][1] + P0[2][2] * P1[2][1], P0[2][0] * P1[0][2] + P0[2][1] * P1[1][2] + P0[2][2] * P1[2][2]]];
    };
    MeeusEngine.matrixTimesVector = function(P, p0) {
      return [P[0][0] * p0[0] + P[0][1] * p0[1] + P[0][2] * p0[2], P[1][0] * p0[0] + P[1][1] * p0[1] + P[1][2] * p0[2], P[2][0] * p0[0] + P[2][1] * p0[1] + P[2][2] * p0[2]];
    };
    MeeusEngine.fromJ2000 = function(ec, date) {
      var p0 = MeeusEngine.toUnitVector(ec);
      var P = MeeusEngine.precesionMatrixAt(date);
      var p1 = MeeusEngine.matrixTimesVector(P, p0);
      return MeeusEngine.fromUnitVector(p1);
    };
    MeeusEngine.toJ2000 = function(ec, date) {
      var p1 = MeeusEngine.toUnitVector(ec);
      var invP = MeeusEngine.inversePrecesionMatrixAt(date);
      var p0 = MeeusEngine.matrixTimesVector(invP, p1);
      return MeeusEngine.fromUnitVector(p0);
    };
    MeeusEngine.toEpoch = function(ec, date) {
      var jt = date.centuriesSinceJ2000;
      var jt2 = jt * jt;
      var jt3 = jt * jt2;
      var zeta = (2306.2181 * jt) + (0.30188 * jt2) + (0.017998 * jt3);
      zeta *= MeeusEngine.D2R / 3600.0;
      var z = (2306.2181 * jt) + (1.09468 * jt2) + (0.018203 * jt3);
      z *= MeeusEngine.D2R / 3600.0;
      var theta = (2004.3109 * jt) - (0.42665 * jt2) - (0.041833 * jt3);
      theta *= MeeusEngine.D2R / 3600.0;
      var ra = ec.rightAscension.radians;
      var dec = ec.declination.radians;
      var A = Math.cos(dec) * Math.sin(ra + zeta);
      var B = (Math.cos(theta) * Math.cos(dec) * Math.cos(ra + zeta)) - (Math.sin(theta) * Math.sin(dec));
      var raJNow = Math.atan2(A, B) + z;
      if (raJNow < 0.0)
        raJNow += MeeusEngine.PI2;
      else if (raJNow > MeeusEngine.PI2)
        raJNow -= MeeusEngine.PI2;
      raJNow *= MeeusEngine.R2D;
      var decJNow = Math.acos(Math.sqrt((A * A) + (B * B)));
      if ((decJNow * dec) < 0.0)
        decJNow = -decJNow;
      decJNow *= MeeusEngine.R2D;
      return new equatorialCoordinates_1.EquatorialCoordinates(angle_1.Angle.fromDegrees(raJNow), angle_1.Angle.fromDegrees(decJNow));
    };
    MeeusEngine.calc_SunriseOrSunset_UTC = function(isSunrise, jd, location, twilight) {
      var jt = jd.centuriesSinceJ2000;
      var eqTime = MeeusEngine.calc_EquationOfTime(jt);
      var solarDec = MeeusEngine.calc_Sun_Declination(jt);
      var hourAngle = MeeusEngine.calcHourAngleSunriseOrSunset(isSunrise, location.latitude.degrees, solarDec, twilight);
      var delta = location.longitude.degrees + MeeusEngine.R2D * (hourAngle);
      var utcMinutes = 720 - (4.0 * delta) - eqTime;
      return utcMinutes;
    };
    MeeusEngine.prepareJd = function(date) {
      var jd;
      if (date instanceof Date) {
        jd = utcdate_1.UtcDate.fromDate(date);
      } else if (date instanceof utcdate_1.UtcDate) {
        jd = date;
      } else {
        throw 'date';
      }
      return jd;
    };
    MeeusEngine.calc_SunriseOrSunset = function(isSunrise, jd, location, twilight) {
      var date = jd.toDate();
      var JD = new utcdate_1.UtcDate(utcdate_1.UtcDate.toUtcDays(date.getFullYear(), date.getMonth(), date.getDate()));
      var timezone = -date.getTimezoneOffset() / 60;
      var dst = MeeusEngine.isDaylightSavingsTime(date);
      var latitude = location.latitude.degrees;
      var longitude = location.longitude.degrees;
      var timeUTC = MeeusEngine.calc_SunriseOrSunset_UTC(isSunrise, JD, location, twilight);
      var newTimeUTC = MeeusEngine.calc_SunriseOrSunset_UTC(isSunrise, JD.addMinutes(timeUTC), location, twilight);
      if (typeof(newTimeUTC) == 'number') {
        var timeLocal = newTimeUTC;
        if ((timeLocal >= 0.0) && (timeLocal < 1440.0)) {
          return JD.addMinutes(timeLocal);
        } else {
          var jday = JD.days;
          var increment = ((timeLocal < 0) ? 1 : -1);
          while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
            timeLocal += increment * 1440.0;
            jday -= increment;
          }
          return new utcdate_1.UtcDate(jday).addMinutes(timeLocal);
        }
      } else {
        var doy = MeeusEngine.calcDoyFromJD(JD.days);
        if (((latitude > 66.4) && (doy > 79) && (doy < 267)) || ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {
          var jdy;
          if (isSunrise) {
            jdy = MeeusEngine.calc_JDofNextPrevRiseSet(0, isSunrise, JD.days, latitude, longitude, timezone, dst);
          } else {
            jdy = MeeusEngine.calc_JDofNextPrevRiseSet(1, isSunrise, JD.days, latitude, longitude, timezone, dst);
          }
          throw 'notimplementedyet';
        } else {
          if (isSunrise == true) {
            jdy = MeeusEngine.calc_JDofNextPrevRiseSet(1, isSunrise, JD.days, latitude, longitude, timezone, dst);
          } else {
            jdy = MeeusEngine.calc_JDofNextPrevRiseSet(0, isSunrise, JD.days, latitude, longitude, timezone, dst);
          }
          throw 'notimplementedyet';
        }
      }
    };
    MeeusEngine.calc_JDofNextPrevRiseSet = function(next, rise, JD, latitude, longitude, tz, dst) {
      var julianday = JD;
      var increment = ((next) ? 1.0 : -1.0);
      var time = MeeusEngine.calc_SunriseOrSunset_UTC(rise, julianday, latitude, longitude);
      while (typeof(time) != 'number') {
        julianday += increment;
        time = MeeusEngine.calc_SunriseOrSunset_UTC(rise, julianday, latitude, longitude);
      }
      var timeLocal = time + tz * 60.0 + ((dst) ? 60.0 : 0.0);
      while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
        var incr = ((timeLocal < 0) ? 1 : -1);
        timeLocal += (incr * 1440.0);
        julianday -= incr;
      }
      return julianday;
    };
    MeeusEngine.isLeapYear = function(yr) {
      return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
    };
    MeeusEngine.calcDoyFromJD = function(jd) {
      var z = Math.floor(jd + 0.5);
      var f = (jd + 0.5) - z;
      if (z < 2299161) {
        var A = z;
      } else {
        var alpha = Math.floor((z - 1867216.25) / 36524.25);
        var A = z + 1 + alpha - Math.floor(alpha / 4);
      }
      var B = A + 1524;
      var C = Math.floor((B - 122.1) / 365.25);
      var D = Math.floor(365.25 * C);
      var E = Math.floor((B - D) / 30.6001);
      var day = B - D - Math.floor(30.6001 * E) + f;
      var month = (E < 14) ? E - 1 : E - 13;
      var year = (month > 2) ? C - 4716 : C - 4715;
      var k = (MeeusEngine.isLeapYear(year) ? 1 : 2);
      var doy = Math.floor((275 * month) / 9) - k * Math.floor((month + 9) / 12) + day - 30;
      return doy;
    };
    MeeusEngine.calcSunRa = function(jt, eclipticObliquityCorrection, sunApparentLong) {
      var e = eclipticObliquityCorrection || MeeusEngine.calc_Ecliptic_ObliquityCorrection(jt);
      var lambda = sunApparentLong || MeeusEngine.calc_Sun_ApparentLong(jt);
      var tananum = (Math.cos(MeeusEngine.D2R * e) * Math.sin(MeeusEngine.D2R * lambda));
      var tanadenom = (Math.cos(MeeusEngine.D2R * lambda));
      var alpha_Deg = MeeusEngine.R2D * Math.atan2(tananum, tanadenom);
      return alpha_Deg;
    };
    MeeusEngine.calc_Sun_Declination = function(jt, eclipticObliquityCorrection, sunApparentLong) {
      var e = eclipticObliquityCorrection || MeeusEngine.calc_Ecliptic_ObliquityCorrection(jt);
      var lambda = sunApparentLong || MeeusEngine.calc_Sun_ApparentLong(jt);
      var sint = Math.sin(MeeusEngine.D2R * e) * Math.sin(MeeusEngine.D2R * lambda);
      var delta_Deg = MeeusEngine.R2D * Math.asin(sint);
      return delta_Deg;
    };
    MeeusEngine.calc_EquationOfTime = function(jt, ecliptic_ObliquityCorrection, sunMeanLongitude, earthOrbitEcc, sunMeanAnomaly) {
      var eoc = ecliptic_ObliquityCorrection || MeeusEngine.calc_Ecliptic_ObliquityCorrection(jt);
      var sml = sunMeanLongitude || MeeusEngine.calc_Sun_MeanLongitude(jt);
      var ecc = earthOrbitEcc || MeeusEngine.calc_Earth_OrbitEccentricity(jt);
      var sma = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
      var y = Math.tan(MeeusEngine.D2R * (eoc) / 2.0);
      y *= y;
      var sin2l0 = Math.sin(2.0 * MeeusEngine.D2R * (sml));
      var sinm = Math.sin(MeeusEngine.D2R * (sma));
      var cos2l0 = Math.cos(2.0 * MeeusEngine.D2R * sml);
      var sin4l0 = Math.sin(4.0 * MeeusEngine.D2R * sml);
      var sin2m = Math.sin(2.0 * MeeusEngine.D2R * sma);
      var e_Mins = y * sin2l0 - 2.0 * ecc * sinm + 4.0 * ecc * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * ecc * ecc * sin2m;
      e_Mins = MeeusEngine.R2D * e_Mins * 4.0;
      return e_Mins;
    };
    MeeusEngine.getHRadians = function(twilight) {
      var h = 0.0;
      switch (twilight) {
        case Twilight.Astronomical:
          h = 18;
          break;
        case Twilight.Nautical:
          h = 12;
          break;
        case Twilight.Civil:
          h = 6;
          break;
        case Twilight.Official:
          h = 0.833;
          break;
        default:
          throw 'twilight';
      }
      h += 90;
      return h;
    };
    MeeusEngine.calcHourAngleSunriseOrSunset = function(isSunrise, lat, solarDec, twilight) {
      var latRad = MeeusEngine.D2R * lat;
      var sdRad = MeeusEngine.D2R * solarDec;
      var hrad = MeeusEngine.getHRadians(twilight);
      var HAarg = (Math.cos(MeeusEngine.D2R * hrad) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
      var HA_Rad = Math.acos(HAarg);
      return isSunrise ? HA_Rad : -HA_Rad;
    };
    MeeusEngine.isDaylightSavingsTime = function(date) {
      var jan = new Date(date.getFullYear(), 0, 1);
      var jul = new Date(date.getFullYear(), 6, 1);
      var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
      return date.getTimezoneOffset() < stdTimezoneOffset;
    };
    MeeusEngine.calcAzEl = function(T, localtime, latitude, longitude, zone) {
      var eqTime = MeeusEngine.calc_EquationOfTime(T);
      var theta = MeeusEngine.calc_Sun_Declination(T);
      var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone;
      var earthRadVec = MeeusEngine.calcSunRadVector(T);
      var trueSolarTime = localtime + solarTimeFix;
      while (trueSolarTime > 1440) {
        trueSolarTime -= 1440;
      }
      var hourAngle = trueSolarTime / 4.0 - 180.0;
      if (hourAngle < -180) {
        hourAngle += 360.0;
      }
      var haRad = MeeusEngine.D2R * (hourAngle);
      var csz = Math.sin(MeeusEngine.D2R * (latitude)) * Math.sin(MeeusEngine.D2R * (theta)) + Math.cos(MeeusEngine.D2R * (latitude)) * Math.cos(MeeusEngine.D2R * (theta)) * Math.cos(haRad);
      if (csz > 1.0) {
        csz = 1.0;
      } else if (csz < -1.0) {
        csz = -1.0;
      }
      var zenith = MeeusEngine.R2D * (Math.acos(csz));
      var azDenom = (Math.cos(MeeusEngine.D2R * (latitude)) * Math.sin(MeeusEngine.D2R * (zenith)));
      if (Math.abs(azDenom) > 0.001) {
        var azRad = ((Math.sin(MeeusEngine.D2R * (latitude)) * Math.cos(MeeusEngine.D2R * (zenith))) - Math.sin(MeeusEngine.D2R * (theta))) / azDenom;
        if (Math.abs(azRad) > 1.0) {
          if (azRad < 0) {
            azRad = -1.0;
          } else {
            azRad = 1.0;
          }
        }
        var azimuth = 180.0 - MeeusEngine.R2D * (Math.acos(azRad));
        if (hourAngle > 0.0) {
          azimuth = -azimuth;
        }
      } else {
        if (latitude > 0.0) {
          azimuth = 180.0;
        } else {
          azimuth = 0.0;
        }
      }
      if (azimuth < 0.0) {
        azimuth += 360.0;
      }
      var exoatmElevation = 90.0 - zenith;
      if (exoatmElevation > 85.0) {
        var refractionCorrection = 0.0;
      } else {
        var te = Math.tan(MeeusEngine.D2R * (exoatmElevation));
        if (exoatmElevation > 5.0) {
          var refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
        } else if (exoatmElevation > -0.575) {
          var refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
        } else {
          var refractionCorrection = -20.774 / te;
        }
        refractionCorrection = refractionCorrection / 3600.0;
      }
      var solarZen = zenith - refractionCorrection;
      return (azimuth);
    };
    MeeusEngine.PI = Math.PI;
    MeeusEngine.PI2 = 2.0 * Math.PI;
    MeeusEngine.D2R = Math.PI / 180.0;
    MeeusEngine.R2D = 180.0 / Math.PI;
    MeeusEngine.MinsPerAU = 8.3168775;
    MeeusEngine.TaiToTtOffsetSeconds = 32.184;
    MeeusEngine.LeapSeconds = [{
      utcdays: 2457204.5,
      taiutc: {
        p1: 36,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2456109.5,
      taiutc: {
        p1: 35,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2454832.5,
      taiutc: {
        p1: 34,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2453736.5,
      taiutc: {
        p1: 33,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2451179.5,
      taiutc: {
        p1: 32,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2450630.5,
      taiutc: {
        p1: 31,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2450083.5,
      taiutc: {
        p1: 30,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2449534.5,
      taiutc: {
        p1: 29,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2449169.5,
      taiutc: {
        p1: 28,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2448804.5,
      taiutc: {
        p1: 27,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2448257.5,
      taiutc: {
        p1: 26,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2447892.5,
      taiutc: {
        p1: 25,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2447161.5,
      taiutc: {
        p1: 24,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2446247.5,
      taiutc: {
        p1: 23,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2445516.5,
      taiutc: {
        p1: 22,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2445151.5,
      taiutc: {
        p1: 21,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2444786.5,
      taiutc: {
        p1: 20,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2444239.5,
      taiutc: {
        p1: 19,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2443874.5,
      taiutc: {
        p1: 18,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2443509.5,
      taiutc: {
        p1: 17,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2443144.5,
      taiutc: {
        p1: 16,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2442778.5,
      taiutc: {
        p1: 15,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2442413.5,
      taiutc: {
        p1: 14,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2442048.5,
      taiutc: {
        p1: 13,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2441683.5,
      taiutc: {
        p1: 12,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2441499.5,
      taiutc: {
        p1: 11,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2441317.5,
      taiutc: {
        p1: 10,
        p2: 41317,
        p3: 0
      }
    }, {
      utcdays: 2439887.5,
      taiutc: {
        p1: 4.2131700,
        p2: 39126,
        p3: 0.002592
      }
    }, {
      utcdays: 2439126.5,
      taiutc: {
        p1: 4.3131700,
        p2: 39126,
        p3: 0.002592
      }
    }, {
      utcdays: 2439004.5,
      taiutc: {
        p1: 3.8401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438942.5,
      taiutc: {
        p1: 3.7401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438820.5,
      taiutc: {
        p1: 3.6401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438761.5,
      taiutc: {
        p1: 3.5401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438639.5,
      taiutc: {
        p1: 3.4401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438486.5,
      taiutc: {
        p1: 3.3401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438395.5,
      taiutc: {
        p1: 3.2401300,
        p2: 38761,
        p3: 0.001296
      }
    }, {
      utcdays: 2438334.5,
      taiutc: {
        p1: 1.9458580,
        p2: 37665,
        p3: 0.0011232
      }
    }, {
      utcdays: 2437665.5,
      taiutc: {
        p1: 1.8458580,
        p2: 37665,
        p3: 0.0011232
      }
    }, {
      utcdays: 2437512.5,
      taiutc: {
        p1: 1.3728180,
        p2: 37300,
        p3: 0.001296
      }
    }, {
      utcdays: 2437300.5,
      taiutc: {
        p1: 1.4228180,
        p2: 37300,
        p3: 0.001296
      }
    }];
    return MeeusEngine;
  }());
  exports.MeeusEngine = MeeusEngine;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/datetime/utcdate", ["sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var UtcDate = (function() {
    function UtcDate(days) {
      if (days === undefined)
        this._days = UtcDate.getJulianDays(new Date());
      else
        this._days = days;
    }
    Object.defineProperty(UtcDate.prototype, "days", {
      get: function() {
        return this._days;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(UtcDate.prototype, "daysSinceJ2000", {
      get: function() {
        return this._days - 2451545.0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(UtcDate.prototype, "centuriesSinceJ2000", {
      get: function() {
        return this.daysSinceJ2000 / 36525.0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(UtcDate, "J2000", {
      get: function() {
        return new UtcDate(2451545);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(UtcDate, "B1950", {
      get: function() {
        return new UtcDate(2433282.4229166666);
      },
      enumerable: true,
      configurable: true
    });
    UtcDate.prototype.addDays = function(days) {
      return new UtcDate(this.days + days);
    };
    UtcDate.prototype.addHours = function(hours) {
      return new UtcDate(this.days + hours / 24);
    };
    UtcDate.prototype.addMinutes = function(minutes) {
      return new UtcDate(this.days + minutes / 1440);
    };
    UtcDate.prototype.addSeconds = function(seconds) {
      return new UtcDate(this.days + seconds / 86400);
    };
    UtcDate.prototype.addMilliseconds = function(milliseconds) {
      return new UtcDate(this.days + milliseconds / 86400000);
    };
    UtcDate.prototype.toDate = function() {
      var ye;
      var mo;
      var utcDays = this.days;
      var A,
          B,
          C,
          D,
          E,
          F,
          Z;
      F = utcDays + 0.5;
      Z = Math.floor(F);
      F -= Z;
      if (Z < 2299161) {
        A = Z;
      } else {
        A = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + A - Math.floor(A / 4);
      }
      B = A + 1524;
      C = Math.floor((B - 122.1) / 365.25);
      D = Math.floor(365.25 * C);
      E = Math.floor((B - D) / 30.6);
      var dd = B - D - Math.floor(30.6001 * E) + F;
      mo = (E > 13) ? (0 | (E - 13)) : (0 | (E - 1));
      ye = (mo == 1) || (mo == 2) ? (0 | (C - 4715)) : (0 | (C - 4716));
      var hrs = (dd - (0 | dd)) * 24;
      var date = new Date(ye, mo - 1, (0 | dd));
      return new Date(date.getTime() + (hrs * 60 - date.getTimezoneOffset()) * 60000);
    };
    UtcDate.prototype.toLmsTime = function(location) {
      return meeusEngine_1.MeeusEngine.toLmsTime(this, location);
    };
    UtcDate.prototype.toGmsTime = function() {
      return meeusEngine_1.MeeusEngine.toGmsTime(this);
    };
    UtcDate.prototype.toLasTime = function(location) {
      return meeusEngine_1.MeeusEngine.toLasTime(this, location);
    };
    UtcDate.prototype.toGasTime = function() {
      return meeusEngine_1.MeeusEngine.toGasTime(this);
    };
    UtcDate.prototype.toTaiDate = function() {
      return meeusEngine_1.MeeusEngine.toTaiDate(this);
    };
    UtcDate.prototype.toTtDate = function() {
      return meeusEngine_1.MeeusEngine.toTtDate(this);
    };
    UtcDate.prototype.toHjdDate = function(location, position) {
      return meeusEngine_1.MeeusEngine.toHjdDate(this, location, position);
    };
    UtcDate.fromDate = function(date) {
      return new UtcDate(UtcDate.getJulianDays(date));
    };
    UtcDate.fromJ2000Centuries = function(centuries) {
      return new UtcDate(centuries * 36525.0 + 2451545.0);
    };
    UtcDate.isJulianCalendar = function(year, month, day) {
      if (year < 1582)
        return true;
      else if (year > 1582)
        return false;
      else {
        if (month < 10)
          return true;
        else if (month > 10)
          return false;
        else {
          if (day < 5)
            return true;
          else if (day > 14)
            return false;
          else
            throw "This date is not valid as it does not exist in either the Julian or the Gregorian calendars.";
        }
      }
    };
    UtcDate.getJulianDays = function(date) {
      var Y = date.getUTCFullYear();
      var M = date.getUTCMonth();
      var D = date.getUTCDate();
      var h = date.getUTCHours();
      var m = date.getUTCMinutes();
      var s = date.getUTCSeconds();
      var ms = date.getUTCMilliseconds();
      return UtcDate.toUtcDays(Y, M, D, h, m, s, ms);
    };
    UtcDate.toUtcDays = function(year, month, day, hour, minute, second, millisecond) {
      month += 1;
      hour = hour || 0;
      minute = minute || 0;
      second = second || 0;
      millisecond = millisecond || 0;
      var isValid = UtcDate.isJulianCalendar(year, month, day);
      var M = month > 2 ? month : month + 12;
      var Y = month > 2 ? year : year - 1;
      var A = Math.floor(Y / 100);
      var D = Math.floor(30.6001 * (M + 1));
      var B = isValid ? 0 : 2 - A + Math.floor(A / 4);
      var C = Math.floor(365.25 * (Y + 4716));
      return B + C + D - 1524.5 + day + hour / 24 + minute / 1440 + (second + millisecond / 1000) / 86400;
    };
    return UtcDate;
  }());
  exports.UtcDate = UtcDate;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/solarSystem/moon", ["sybilla/datetime/utcdate", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var utcdate_1 = require("sybilla/datetime/utcdate");
  var meeusEngine_1 = require("sybilla/core/meeusEngine");
  var Moon = (function() {
    function Moon() {}
    Moon.positionAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.moonPositionAt(utc);
    };
    Moon.terminatorLongitudeAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.calc_Moon_LongitudeOfTerminator(utc);
    };
    Moon.illuminatedDiscFractionAt = function(date) {
      var utc = date;
      if (utc instanceof Date)
        utc = utcdate_1.UtcDate.fromDate(date);
      return meeusEngine_1.MeeusEngine.calc_Moon_IlluminatedDiscFraction(utc);
    };
    return Moon;
  }());
  exports.Moon = Moon;
  global.define = __define;
  return module.exports;
});

System.register("sybilla/meeus", ["sybilla/angle", "sybilla/solarSystem/moon", "sybilla/solarSystem/earth", "sybilla/solarSystem/sun", "sybilla/datetime/hjddate", "sybilla/datetime/siderealtimes", "sybilla/datetime/taidate", "sybilla/datetime/ttdate", "sybilla/datetime/utcdate", "sybilla/coordinateSystems/eclipticCoordinates", "sybilla/coordinateSystems/equatorialCoordinates", "sybilla/coordinateSystems/geographicCoordinates", "sybilla/coordinateSystems/horizontalCoordinates", "sybilla/core/meeusEngine"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  __export(require("sybilla/angle"));
  __export(require("sybilla/solarSystem/moon"));
  __export(require("sybilla/solarSystem/earth"));
  __export(require("sybilla/solarSystem/sun"));
  __export(require("sybilla/datetime/hjddate"));
  __export(require("sybilla/datetime/siderealtimes"));
  __export(require("sybilla/datetime/taidate"));
  __export(require("sybilla/datetime/ttdate"));
  __export(require("sybilla/datetime/utcdate"));
  __export(require("sybilla/coordinateSystems/eclipticCoordinates"));
  __export(require("sybilla/coordinateSystems/equatorialCoordinates"));
  __export(require("sybilla/coordinateSystems/geographicCoordinates"));
  __export(require("sybilla/coordinateSystems/horizontalCoordinates"));
  __export(require("sybilla/core/meeusEngine"));
  global.define = __define;
  return module.exports;
});

