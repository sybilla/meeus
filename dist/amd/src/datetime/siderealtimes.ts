import {UtcDate} from './utcdate';

export class __BaseTime {
    protected _hours: number;

    /**
     *
     */
    constructor(hours: number) {
        this._hours = hours;
    }

    public get hours(): number {
        return this._hours;
    }

    public get hour(): number {
        return (0 | this._hours);
    }

    public get minutes(): number {
        return (this.hours - this.hour) * 60;
    }

    public get minute(): number {
        return (0 | this.minutes);
    }

    public get seconds(): number {
        return (this.minutes - this.minute) * 60;
    }

    public get second(): number {
        return (0 | this.seconds);
    }

    public get milliseconds(): number {
        return (this.seconds - this.second) * 1000;
    }

    public get millisecond(): number {
        return (0 | this.milliseconds);
    }

    toFormattedString(): string {
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

    private static absPad(val: number, fixed?: number) {
        var fixedValue = Math.abs(val).toFixed(fixed || 0);
        var fixedNumber = parseFloat(fixedValue);
        return ((fixedNumber < 10 && fixedNumber > -10) ? '0' : '') + fixedValue;
    }
}

export class GmsTime extends __BaseTime {
    public static fromDate(date: Date): GmsTime {
        return UtcDate.fromDate(date).toGmsTime();
    }
}

export class LmsTime extends __BaseTime { }

export class GasTime extends __BaseTime {
    public static fromDate(date: Date): GasTime {
        return UtcDate.fromDate(date).toGasTime();
    }
}

export class LasTime extends __BaseTime { }