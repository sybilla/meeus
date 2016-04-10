export class TaiDate {
    /**
     *
     */
    constructor(days) {
        this._days = days;
    }
    get days() {
        return this._days;
    }
    get daysSinceJ2000() {
        return this._days - 2451545.0;
    }
    get centuriesSinceJ2000() {
        return this.daysSinceJ2000 / 36525.0;
    }
    addDays(days) {
        return new TaiDate(this.days + days);
    }
    addHours(hours) {
        return new TaiDate(this.days + hours / 24);
    }
    addMinutes(minutes) {
        return new TaiDate(this.days + minutes / 1440);
    }
    addSeconds(seconds) {
        return new TaiDate(this.days + seconds / 86400);
    }
    addMilliseconds(milliseconds) {
        return new TaiDate(this.days + milliseconds / 86400000);
    }
}
//# sourceMappingURL=taidate.js.map