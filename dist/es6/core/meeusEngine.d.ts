import { Angle } from '../angle';
import { UtcDate } from '../datetime/utcdate';
import { HjdDate } from '../datetime/hjddate';
import { TtDate } from '../datetime/ttdate';
import { GasTime, GmsTime, LmsTime, LasTime } from '../datetime/siderealtimes';
import { TaiDate } from '../datetime/taidate';
import { GeographicCoordinates } from '../coordinateSystems/geographicCoordinates';
import { EquatorialCoordinates } from '../coordinateSystems/equatorialCoordinates';
import { HorizontalCoordinates } from '../coordinateSystems/horizontalCoordinates';
export declare enum Twilight {
    Official = 0,
    Astronomical = 1,
    Nautical = 2,
    Civil = 3,
}
export interface Vector {
    x: number;
    y: number;
    z: number;
}
export declare class MeeusEngine {
    static PI: number;
    static PI2: number;
    static D2R: number;
    static R2D: number;
    static MinsPerAU: number;
    static TaiToTtOffsetSeconds: number;
    static LeapSeconds: {
        utcdays: number;
        taiutc: {
            p1: number;
            p2: number;
            p3: number;
        };
    }[];
    private static getLeapSeconds(days);
    static toTaiDate(date: UtcDate): TaiDate;
    static toTtDate(date: UtcDate): TtDate;
    static toGmsTime(date: UtcDate): GmsTime;
    static toLmsTime(date: UtcDate, location: GeographicCoordinates | Angle | number): LmsTime;
    static toGasTime(date: UtcDate): GasTime;
    static toLasTime(date: UtcDate, location: GeographicCoordinates | Angle | number): LasTime;
    static toHjdDate(date: UtcDate, location: GeographicCoordinates, position: EquatorialCoordinates): HjdDate;
    static getSunriseAt(location: GeographicCoordinates, date?: UtcDate | Date, twilight?: Twilight): UtcDate;
    static getSunsetAt(location: GeographicCoordinates, date?: UtcDate | Date, twilight?: Twilight): UtcDate;
    static sunPositionAt(date: UtcDate): EquatorialCoordinates;
    static earthPositionAt(date: UtcDate): EquatorialCoordinates;
    static moonPositionAt(date: UtcDate): EquatorialCoordinates;
    static getAngularSeparation(ob1: EquatorialCoordinates, ob2: EquatorialCoordinates): Angle;
    static toHorizontalCoordinates(ec: EquatorialCoordinates, date: UtcDate | Date, location: GeographicCoordinates): HorizontalCoordinates;
    static toEquatorialCoordinates(position: HorizontalCoordinates, date: UtcDate | Date, location: GeographicCoordinates): EquatorialCoordinates;
    static dsin(x: any): number;
    static dcos(x: any): number;
    static dtan(x: any): number;
    static dasin(x: any): number;
    static dacos(x: any): number;
    static datan(x: any): number;
    static datan2(y: any, x: any): any;
    static normalize(x: number): number;
    private static addCartesian(o1, o2);
    static equatorialToCartesian(position: EquatorialCoordinates): Vector;
    private static geographicToCartesian(location, date);
    private static preparePositionalParameters(jt);
    static calc_Earth_OrbitEccentricity(jt: number): number;
    static earthCartesianPositionAt(date: UtcDate): Vector;
    static earthCartesianVelocityAt(date: UtcDate): Vector;
    private static convertToHeliocentric(location, date);
    private static calc_Ecliptic_MeanObliquity(jt, jt2?, jt3?);
    private static calc_Ecliptic_ObliquityCorrection(jt, eclipticMeanObliquity?);
    private static calc_Sun_Earth_Distance(jt, earthEcc?, sunMeanAnomaly?, sunEqOfCenter?, sunTrueAnomaly?);
    private static calc_Sun_MeanLongitude(jt);
    private static calc_Sun_MeanAnomaly(jt, jt2?, jt3?);
    private static calc_Sun_EqOfCenter(jt, sunMeanAnomaly?);
    private static calc_Sun_TrueLong(jt, sunMeanLongitude?, sunEqOfCenter?);
    private static calc_Sun_TrueAnomaly(jt, sunMeanAnomaly?, sunEqOfCenter?);
    private static calcSunRadVector(jt, sunTrueAnomaly?, earthOrbitEcc?);
    private static calc_Sun_LongitudeOfAscendingNode(jt, jt2?, jt3?);
    private static calc_Sun_ApparentLong(jt, sunTrueLong?, sunLongOfAscNode?);
    private static calc_Moon_MeanAnomaly(jt, jt2?, jt3?);
    private static calc_Moon_MeanElongation(jt, jt2?, jt3?);
    private static calc_Moon_MeanLongitude(jt);
    private static calc_Moon_LongitudeAscendingNode(jt, jt2, jt3);
    private static calc_Moon_Earth_Distance(moonMeanAnomaly, moonMeanElongation);
    private static calc_Moon_Sun_DistanceRatio(moonEarthDistance, sunEarthDistance);
    private static calc_Moon_GeocentricLatitude(moonArgOfLatitude, moonMeanAnomaly, moonMeanElongation);
    private static calc_Moon_GeocentricLongitude(moonMeanAnomaly, moonMeanElongation, moonMeanLongitude, moonArgumentOfLatitude, sunMeanAnomaly);
    private static calc_Moon_HeliocentricLatitude(moonSunDistanceRatio, moonGeocentricLatitude);
    private static calc_Moon_HeliocentricLongitude(sunApparentLongitude, moonSunDistanceRatio, moonHeliocentricLatitude, moonGeocentricLongitude);
    private static calc_Moon_ArgumentOfLatitude(jt, jt2?, jt3?);
    static calc_Moon_LongitudeOfTerminator(u: UtcDate): Angle;
    static calc_Moon_IlluminatedDiscFraction(u: UtcDate): number;
    private static calc_Ecliptic_NutationInLongitude(jt, sunLongitudeOfAscendinNode, moonMeanElongation, moonArgumentOfLatitude, sunMeanAnomaly, moonMeanAnomaly);
    private static calc_Ecliptic_MeanObliquityCorrection(jt, jt2, jt3, OMs, Ds, DFs, Ms, M1s);
    private static toGasDegrees(date);
    private static correctForRefraction(altitude);
    private static uncorrectRefraction(altitude);
    private static toTopocentric(hc);
    private static toGeocentric(hc);
    private static toUnitVector(ec);
    private static fromUnitVector(uv);
    private static precesionMatrixParams(date);
    private static determinant3x3(m);
    private static inverse3x3(m);
    private static inversePrecesionMatrixAt(date);
    private static precesionMatrixAt(date);
    private static matrixTimesMatrix(P0, P1);
    private static matrixTimesVector(P, p0);
    private static fromJ2000(ec, date);
    private static toJ2000(ec, date);
    private static toEpoch(ec, date);
    private static calc_SunriseOrSunset_UTC(isSunrise, jd, location, twilight);
    private static prepareJd(date);
    private static calc_SunriseOrSunset(isSunrise, jd, location, twilight);
    private static calc_JDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz, dst);
    private static isLeapYear(yr);
    private static calcDoyFromJD(jd);
    private static calcSunRa(jt, eclipticObliquityCorrection?, sunApparentLong?);
    private static calc_Sun_Declination(jt, eclipticObliquityCorrection?, sunApparentLong?);
    private static calc_EquationOfTime(jt, ecliptic_ObliquityCorrection?, sunMeanLongitude?, earthOrbitEcc?, sunMeanAnomaly?);
    private static getHRadians(twilight);
    private static calcHourAngleSunriseOrSunset(isSunrise, lat, solarDec, twilight);
    private static isDaylightSavingsTime(date);
    private static calcAzEl(T, localtime, latitude, longitude, zone);
}
