export class TtDate {
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
        return new TtDate(this.days + days);
    }
    addHours(hours) {
        return new TtDate(this.days + hours / 24);
    }
    addMinutes(minutes) {
        return new TtDate(this.days + minutes / 1440);
    }
    addSeconds(seconds) {
        return new TtDate(this.days + seconds / 86400);
    }
    addMilliseconds(milliseconds) {
        return new TtDate(this.days + milliseconds / 86400000);
    }
}
//# sourceMappingURL=ttdate.js.map