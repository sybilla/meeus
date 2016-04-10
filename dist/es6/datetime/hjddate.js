export class HjdDate {
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
        return new HjdDate(this.days + days);
    }
    addHours(hours) {
        return new HjdDate(this.days + hours / 24);
    }
    addMinutes(minutes) {
        return new HjdDate(this.days + minutes / 1440);
    }
    addSeconds(seconds) {
        return new HjdDate(this.days + seconds / 86400);
    }
    addMilliseconds(milliseconds) {
        return new HjdDate(this.days + milliseconds / 86400000);
    }
}
//# sourceMappingURL=hjddate.js.map