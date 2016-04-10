import { UtcDate } from './utcdate';
export class __BaseTime {
    /**
     *
     */
    constructor(hours) {
        this._hours = hours;
    }
    get hours() {
        return this._hours;
    }
    get hour() {
        return (0 | this._hours);
    }
    get minutes() {
        return (this.hours - this.hour) * 60;
    }
    get minute() {
        return (0 | this.minutes);
    }
    get seconds() {
        return (this.minutes - this.minute) * 60;
    }
    get second() {
        return (0 | this.seconds);
    }
    get milliseconds() {
        return (this.seconds - this.second) * 1000;
    }
    get millisecond() {
        return (0 | this.milliseconds);
    }
    toFormattedString() {
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
    }
    static absPad(val, fixed) {
        var fixedValue = Math.abs(val).toFixed(fixed || 0);
        var fixedNumber = parseFloat(fixedValue);
        return ((fixedNumber < 10 && fixedNumber > -10) ? '0' : '') + fixedValue;
    }
}
export class GmsTime extends __BaseTime {
    static fromDate(date) {
        return UtcDate.fromDate(date).toGmsTime();
    }
}
export class LmsTime extends __BaseTime {
}
export class GasTime extends __BaseTime {
    static fromDate(date) {
        return UtcDate.fromDate(date).toGasTime();
    }
}
export class LasTime extends __BaseTime {
}
//# sourceMappingURL=siderealtimes.js.map