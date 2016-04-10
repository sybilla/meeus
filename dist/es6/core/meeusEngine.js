import { Angle } from '../angle';
import { UtcDate } from '../datetime/utcdate';
import { HjdDate } from '../datetime/hjddate';
import { TtDate } from '../datetime/ttdate';
import { GasTime, GmsTime, LmsTime, LasTime } from '../datetime/siderealtimes';
import { TaiDate } from '../datetime/taidate';
import { GeographicCoordinates } from '../coordinateSystems/geographicCoordinates';
import { EquatorialCoordinates } from '../coordinateSystems/equatorialCoordinates';
import { HorizontalCoordinates } from '../coordinateSystems/horizontalCoordinates';
export var Twilight;
(function (Twilight) {
    Twilight[Twilight["Official"] = 0] = "Official";
    Twilight[Twilight["Astronomical"] = 1] = "Astronomical";
    Twilight[Twilight["Nautical"] = 2] = "Nautical";
    Twilight[Twilight["Civil"] = 3] = "Civil";
})(Twilight || (Twilight = {}));
;
/*
    * MeeusEngine + findings, bonuses, helpers
    *    see also:
    *    http://aa.usno.navy.mil/faq/index.php
    *    http://www.jgiesen.de/astro/astroJS/siderealClock/
    *    http://xjubier.free.fr/en/site_pages/astronomy/coordinatesConverter.html (better GAST)
    *    http://www.stargazing.net/kepler/jsmoon.html
    */
export class MeeusEngine {
    static getLeapSeconds(days) {
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
    }
    //#region times
    static toTaiDate(date) {
        var diffSeconds = MeeusEngine.getLeapSeconds(date.days);
        return new TaiDate(date.days + diffSeconds / 86400);
    }
    static toTtDate(date) {
        var diffSeconds = MeeusEngine.getLeapSeconds(date.days) + MeeusEngine.TaiToTtOffsetSeconds;
        return new TtDate(date.days + diffSeconds / 86400);
    }
    static toGmsTime(date) {
        var jd = date.daysSinceJ2000;
        var jt = jd / 36525.0;
        var jt2 = jt * jt;
        var jt3 = jt2 * jt;
        var st = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jt2 - jt3 / 38710000;
        return new GmsTime(MeeusEngine.normalize(st) / 15.0);
    }
    static toLmsTime(date, location) {
        var longitude = location;
        if (longitude instanceof Angle)
            longitude = longitude.degrees;
        else if (longitude instanceof GeographicCoordinates)
            longitude = longitude.longitude.degrees;
        var jd = date.daysSinceJ2000;
        var jt = jd / 36525.0;
        var jt2 = jt * jt;
        var jt3 = jt2 * jt;
        var st = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jt2 - jt3 / 38710000 + longitude;
        return new LmsTime(MeeusEngine.normalize(st) / 15.0);
    }
    static toGasTime(date) {
        return new GasTime(MeeusEngine.toGasDegrees(date) / 15.0);
    }
    static toLasTime(date, location) {
        var longitude = location;
        if (longitude instanceof Angle)
            longitude = longitude.degrees;
        else if (longitude instanceof GeographicCoordinates)
            longitude = longitude.longitude.degrees;
        var st = MeeusEngine.toGasDegrees(date);
        st = st + longitude;
        return new LasTime(MeeusEngine.normalize(st) / 15);
    }
    static toHjdDate(date, location, position) {
        var earthPos = MeeusEngine.earthPositionAt(date);
        //				var ePos = MeeusEngine.addCartesian(
        //							MeeusEngine.equatorialToCartesian(earthPos), 
        //							MeeusEngine.convertToHeliocentric(location, date));
        var ePos = MeeusEngine.equatorialToCartesian(earthPos);
        var oPos = MeeusEngine.equatorialToCartesian(position);
        var corr = MeeusEngine.MinsPerAU * (ePos.x * oPos.x + ePos.y * oPos.y + ePos.z * oPos.z);
        return new HjdDate(date.days).addMinutes(corr);
    }
    //#endregion times
    //#region sunrise/sunset
    static getSunriseAt(location, date, twilight) {
        return MeeusEngine.calc_SunriseOrSunset(true, MeeusEngine.prepareJd(date || new Date()), location, twilight || Twilight.Official);
    }
    static getSunsetAt(location, date, twilight) {
        return MeeusEngine.calc_SunriseOrSunset(false, MeeusEngine.prepareJd(date || new Date()), location, twilight || Twilight.Official);
    }
    //#endregion sunrise/sunset
    //#region Sun/Moon Ephemerides
    static sunPositionAt(date) {
        var params = MeeusEngine.preparePositionalParameters(date.centuriesSinceJ2000);
        var stl = params.sun.trueLongitude;
        var emo = params.ecliptic.meanObliquity;
        var raDeg = MeeusEngine.datan2(MeeusEngine.dsin(stl) * MeeusEngine.dcos(emo) - MeeusEngine.dtan(0) * MeeusEngine.dsin(emo), MeeusEngine.dcos(stl));
        var decDeg = MeeusEngine.dasin(MeeusEngine.dsin(0) * MeeusEngine.dcos(emo) + MeeusEngine.dcos(0) * MeeusEngine.dsin(emo) * MeeusEngine.dsin(stl));
        return new EquatorialCoordinates(Angle.fromDegrees(raDeg), Angle.fromDegrees(decDeg));
    }
    static earthPositionAt(date) {
        var params = MeeusEngine.preparePositionalParameters(date.centuriesSinceJ2000);
        var stl = params.sun.trueLongitude;
        var emo = params.ecliptic.meanObliquity;
        var raDeg = MeeusEngine.datan2(MeeusEngine.dsin(stl) * MeeusEngine.dcos(emo) - MeeusEngine.dtan(0) * MeeusEngine.dsin(emo), MeeusEngine.dcos(stl));
        var decDeg = MeeusEngine.dasin(MeeusEngine.dsin(0) * MeeusEngine.dcos(emo) + MeeusEngine.dcos(0) * MeeusEngine.dsin(emo) * MeeusEngine.dsin(stl));
        raDeg += 180;
        if (raDeg > 360)
            raDeg -= 360;
        decDeg *= -1;
        return new EquatorialCoordinates(Angle.fromDegrees(raDeg), Angle.fromDegrees(decDeg));
    }
    static moonPositionAt(date) {
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
        return new EquatorialCoordinates(Angle.fromDegrees(raDeg), Angle.fromDegrees(decDeg));
    }
    //#endregion Sun/Moon Ephemerides
    //#region coordinates' transforms
    static getAngularSeparation(ob1, ob2) {
        var o1ra = ob1.rightAscension.radians;
        var o1dec = ob1.declination.radians;
        var o2ra = ob2.rightAscension.radians;
        var o2dec = ob2.declination.radians;
        var y = Math.sqrt(((Math.cos(o2dec) * Math.sin(o1ra - o2ra))) * ((Math.cos(o2dec) * Math.sin(o1ra - o2ra))) +
            ((Math.cos(o1dec) * Math.sin(o2dec) - Math.cos(o2dec) * Math.sin(o1dec) * Math.cos(o1ra - o2ra))) *
                ((Math.cos(o1dec) * Math.sin(o2dec) - Math.cos(o2dec) * Math.sin(o1dec) * Math.cos(o1ra - o2ra))));
        var x = Math.sin(o1dec) * Math.sin(o2dec) + Math.cos(o1dec) * Math.cos(o2dec) * Math.cos(o1ra - o2ra);
        var angularSeparation = Math.atan2(y, x) * MeeusEngine.R2D; //degrees
        return Angle.fromDegrees(angularSeparation);
    }
    static toHorizontalCoordinates(ec, date, location) {
        var utc;
        var mst;
        if (date instanceof Date)
            utc = UtcDate.fromDate(date);
        else if (date instanceof UtcDate)
            utc = date;
        var ecAtUtc = MeeusEngine.fromJ2000(ec, utc); //.toEpoch(ec, utc);
        mst = MeeusEngine.toLasTime(utc, location.longitude.degrees);
        var ha = Angle.fromHours(mst.hours - ecAtUtc.rightAscension.hours).normalize();
        var haRad = ha.radians;
        var decRad = ecAtUtc.declination.radians;
        var latRad = location.latitude.radians;
        var sinAltRad = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
        var altRad = Math.asin(sinAltRad);
        var cosAzRad = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (Math.cos(altRad) * Math.cos(latRad));
        var azRad = Math.acos(cosAzRad);
        var h_alt = altRad * MeeusEngine.R2D;
        var h_az = azRad * MeeusEngine.R2D;
        // choose hemisphere
        if (Math.sin(haRad) > 0)
            h_az = 360 - h_az;
        //return new meeus.HorizontalCoordinates(Angle.fromDegrees(h_alt), Angle.fromDegrees(h_az));
        //				console.log('toHorizontalCoordinates: ' + h_alt);
        return new HorizontalCoordinates(MeeusEngine.toTopocentric(h_alt), Angle.fromDegrees(h_az));
    }
    static toEquatorialCoordinates(position, date, location) {
        var utc;
        if (date instanceof Date)
            utc = UtcDate.fromDate(date);
        else if (date instanceof UtcDate)
            utc = date;
        var a = position.azimuth.degrees + 180;
        if (a >= 360)
            a -= 360;
        var aRad = a * MeeusEngine.D2R;
        var latRad = location.latitude.radians;
        //				console.log('toEquatorialCoordinates: ' + position.altitude.degrees);
        var altRad = MeeusEngine.toGeocentric(position.altitude).radians;
        //var altRad = position.altitude.radians;
        var localHourAngle = Angle.fromRadians(Math.atan2(Math.sin(aRad), Math.cos(aRad) * Math.sin(latRad) + Math.tan(altRad) * Math.cos(latRad)));
        var mst = utc.toLasTime(location.longitude.degrees);
        // Note: Meeus uses the reverse convention for the Longitude
        var rightAscenstion = Angle.fromHours(mst.hours - localHourAngle.hours).normalize();
        var sinDeclination = Math.sin(latRad) * Math.sin(altRad) - Math.cos(latRad) * Math.cos(altRad) * Math.cos(aRad);
        if (sinDeclination < -1 || sinDeclination > 1)
            throw 'Illegal value: ' + sinDeclination + ', should be in [-1,1].';
        var declination = Math.asin(sinDeclination);
        return MeeusEngine.toJ2000(new EquatorialCoordinates(rightAscenstion, Angle.fromRadians(declination)), utc);
    }
    //#endregion coordinates' transforms
    //#region Math helpers 
    static dsin(x) { return Math.sin(MeeusEngine.D2R * x); }
    static dcos(x) { return Math.cos(MeeusEngine.D2R * x); }
    static dtan(x) { return Math.tan(MeeusEngine.D2R * x); }
    static dasin(x) { return MeeusEngine.R2D * Math.asin(x); }
    static dacos(x) { return MeeusEngine.R2D * Math.acos(x); }
    static datan(x) { return MeeusEngine.R2D * Math.atan(x); }
    static datan2(y, x) {
        var a;
        if ((x == 0) && (y == 0)) {
            return 0;
        }
        else {
            a = MeeusEngine.datan(y / x);
            if (x < 0) {
                a = a + 180;
            }
            if (y < 0 && x > 0) {
                a = a + 360;
            }
            return a;
        }
    }
    static normalize(x) { return x - (360.0 * Math.floor(x / 360.0)); }
    //#endregion Math helpers
    //#region Cartesian Coordinates helpers
    static addCartesian(o1, o2) {
        return {
            x: o1.x + o2.x,
            y: o1.y + o2.y,
            z: o1.z + o2.z
        };
    }
    static equatorialToCartesian(position) {
        var raRad = position.rightAscension.radians;
        var decRad = position.declination.radians;
        var c = Math.cos(decRad);
        var x = Math.cos(raRad) * c;
        var y = Math.sin(raRad) * c;
        var z = Math.sin(decRad);
        return { x: x, y: y, z: z };
    }
    static geographicToCartesian(location, date) {
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
    }
    //#endregion Cartesian Coordinates helpers
    //#region Sun & Moon ephemerides' helpers
    static preparePositionalParameters(jt) {
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
            ecliptic: { meanObliquity: emo }
        };
    }
    //Earth
    static calc_Earth_OrbitEccentricity(jt) {
        return 0.016708634 - jt * (0.000042037 + 0.0000001267 * jt);
    }
    static earthCartesianPositionAt(date) {
        var p1 = MeeusEngine.earthPositionAt(date);
        return MeeusEngine.equatorialToCartesian(p1);
    }
    static earthCartesianVelocityAt(date) {
        var p1 = MeeusEngine.earthPositionAt(date);
        var p0 = MeeusEngine.earthPositionAt(date.addMinutes(-1));
        var c1 = MeeusEngine.equatorialToCartesian(p1);
        var c0 = MeeusEngine.equatorialToCartesian(p0);
        return {
            x: (c1.x - c0.x) / 0.000704,
            y: (c1.y - c0.y) / 0.000704,
            z: (c1.z - c0.z) / 0.000704
        };
    }
    static convertToHeliocentric(location, date) {
        var p = MeeusEngine.earthCartesianPositionAt(date);
        var geo_location = MeeusEngine.geographicToCartesian(location, date);
        var helio_location = {
            x: p.x + geo_location.x,
            y: p.y + geo_location.y,
            z: p.z + geo_location.z
        };
        return helio_location;
    }
    //Ecliptic
    static calc_Ecliptic_MeanObliquity(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt2 * jt;
        return (21.448 / 60 + 26) / 60 + 23 + (-46.815 * jt - 0.00059 * jt2 + 0.001813 * jt3) / 3600; // degrees
    }
    static calc_Ecliptic_ObliquityCorrection(jt, eclipticMeanObliquity) {
        var e0 = eclipticMeanObliquity || MeeusEngine.calc_Ecliptic_MeanObliquity(jt);
        var omega = MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt);
        return e0 + 0.00256 * Math.cos(MeeusEngine.D2R * omega); // degrees
    }
    //Sun
    static calc_Sun_Earth_Distance(jt, earthEcc, sunMeanAnomaly, sunEqOfCenter, sunTrueAnomaly) {
        earthEcc = earthEcc || MeeusEngine.calc_Earth_OrbitEccentricity(jt);
        sunMeanAnomaly = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
        sunEqOfCenter = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt, sunMeanAnomaly);
        sunTrueAnomaly = sunTrueAnomaly || MeeusEngine.calc_Sun_TrueAnomaly(jt, sunMeanAnomaly, sunEqOfCenter);
        return 0.99972 / (1 + earthEcc * MeeusEngine.dcos(sunTrueAnomaly));
    }
    static calc_Sun_MeanLongitude(jt) {
        return MeeusEngine.normalize(280.46646 + jt * (36000.76983 + jt * 0.0003032));
    }
    static calc_Sun_MeanAnomaly(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt * jt2;
        return MeeusEngine.normalize(357.52772 + 35999.05034 * jt - 0.0001603 * jt2 - jt3 / 300000);
    }
    static calc_Sun_EqOfCenter(jt, sunMeanAnomaly) {
        var sma = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
        var mrad = MeeusEngine.D2R * sma;
        var sinm = Math.sin(mrad);
        var sin2m = Math.sin(mrad + mrad);
        var sin3m = Math.sin(mrad + mrad + mrad);
        return sinm * (1.914602 - jt * (0.004817 + 0.000014 * jt)) + sin2m * (0.019993 - 0.000101 * jt) + sin3m * 0.000289; // degrees
    }
    static calc_Sun_TrueLong(jt, sunMeanLongitude, sunEqOfCenter) {
        var sml = sunMeanLongitude || MeeusEngine.calc_Sun_MeanLongitude(jt);
        var sec = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt);
        return sml + sec; // degrees
    }
    static calc_Sun_TrueAnomaly(jt, sunMeanAnomaly, sunEqOfCenter) {
        var sma = sunMeanAnomaly || MeeusEngine.calc_Sun_MeanAnomaly(jt);
        var sec = sunEqOfCenter || MeeusEngine.calc_Sun_EqOfCenter(jt);
        return sma + sec; // degrees
    }
    static calcSunRadVector(jt, sunTrueAnomaly, earthOrbitEcc) {
        var sta = sunTrueAnomaly || MeeusEngine.calc_Sun_TrueAnomaly(jt);
        var ecc = earthOrbitEcc || MeeusEngine.calc_Earth_OrbitEccentricity(jt);
        var R_AU = (1.000001018 * (1 - ecc * ecc)) / (1 + ecc * Math.cos(MeeusEngine.D2R * sta));
        return R_AU; // AUs
    }
    static calc_Sun_LongitudeOfAscendingNode(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt2 * jt;
        return MeeusEngine.normalize(125.04452 - 1934.136261 * jt + 0.0020708 * jt2 + jt3 / 450000);
    }
    static calc_Sun_ApparentLong(jt, sunTrueLong, sunLongOfAscNode) {
        var stl = sunTrueLong || MeeusEngine.calc_Sun_TrueLong(jt);
        var sunLongOfAscNode = sunLongOfAscNode || MeeusEngine.calc_Sun_LongitudeOfAscendingNode(jt);
        return stl - 0.00569 - 0.00478 * Math.sin(MeeusEngine.D2R * sunLongOfAscNode); // degrees
    }
    static calc_Moon_MeanAnomaly(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt2 * jt;
        return MeeusEngine.normalize(134.96298 + 477198.867398 * jt + 0.0086972 * jt2 + jt3 / 56250); // degrees
    }
    static calc_Moon_MeanElongation(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt2 * jt;
        return MeeusEngine.normalize(297.85036 + 445267.11148 * jt - 0.0019142 * jt2 + jt3 / 189474);
        //return  MeeusEngine.normalize(297.85 + 445267 * jt - 0.00163 * jt2 + jt3/545900) <- is this one correct?	
    }
    // Moon
    static calc_Moon_MeanLongitude(jt) {
        return MeeusEngine.normalize(218.316 + 481267.8813 * jt);
    }
    static calc_Moon_LongitudeAscendingNode(jt, jt2, jt3) {
        return MeeusEngine.normalize(125.045 - 1934.14 * jt + 0.002071 * jt2 + jt3 / 450000);
    }
    static calc_Moon_Earth_Distance(moonMeanAnomaly, moonMeanElongation) {
        var mme2 = moonMeanElongation * 2;
        return 1 + (-20954 * MeeusEngine.dcos(moonMeanAnomaly) - 3699 * MeeusEngine.dcos(mme2 - moonMeanAnomaly) - 2956 * MeeusEngine.dcos(moonMeanAnomaly)) / 385000;
    }
    static calc_Moon_Sun_DistanceRatio(moonEarthDistance, sunEarthDistance) {
        return (moonEarthDistance / sunEarthDistance) / 379.168831168831;
    }
    static calc_Moon_GeocentricLatitude(moonArgOfLatitude, moonMeanAnomaly, moonMeanElongation) {
        var me2 = moonMeanElongation * 2;
        var geo_lat = 5.128 * MeeusEngine.dsin(moonArgOfLatitude) + 0.2806 * MeeusEngine.dsin(moonMeanAnomaly + moonArgOfLatitude);
        geo_lat = geo_lat + 0.2777 * MeeusEngine.dsin(moonMeanAnomaly - moonArgOfLatitude) + 0.1732 * MeeusEngine.dsin(me2 - moonArgOfLatitude);
        return geo_lat;
    }
    static calc_Moon_GeocentricLongitude(moonMeanAnomaly, moonMeanElongation, moonMeanLongitude, moonArgumentOfLatitude, sunMeanAnomaly) {
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
    }
    static calc_Moon_HeliocentricLatitude(moonSunDistanceRatio, moonGeocentricLatitude) {
        return moonSunDistanceRatio * moonGeocentricLatitude;
    }
    static calc_Moon_HeliocentricLongitude(sunApparentLongitude, moonSunDistanceRatio, moonHeliocentricLatitude, moonGeocentricLongitude) {
        return MeeusEngine.normalize(sunApparentLongitude + 180 + (180 / Math.PI) * moonSunDistanceRatio * MeeusEngine.dcos(moonHeliocentricLatitude) * MeeusEngine.dsin(sunApparentLongitude - moonGeocentricLongitude));
    }
    static calc_Moon_ArgumentOfLatitude(jt, jt2, jt3) {
        jt2 = jt2 || jt * jt;
        jt3 = jt3 || jt2 * jt;
        return MeeusEngine.normalize(93.27191 + 483202.017538 * jt - 0.0036825 * jt2 + jt3 / 327270);
    }
    static calc_Moon_LongitudeOfTerminator(u) {
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
        var Co, SLt;
        if (SL < 90) {
            Co = 90 - SL;
        }
        else {
            Co = 450 - SL;
        }
        if ((Co > 90) && (Co < 270)) {
            SLt = 180 - Co;
        }
        else {
            if (Co < 90) {
                SLt = 0 - Co;
            }
            else {
                SLt = 360 - Co;
            }
        }
        return Angle.fromDegrees(SLt);
    }
    static calc_Moon_IlluminatedDiscFraction(u) {
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
    }
    //#endregion Sun & Moon ephemerides' helpers
    //#region Sidereal Time helpers
    static calc_Ecliptic_NutationInLongitude(jt, sunLongitudeOfAscendinNode, moonMeanElongation, moonArgumentOfLatitude, sunMeanAnomaly, moonMeanAnomaly) {
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
        corr *= 0.0001 / 3600; // arcsec to degrees
        return corr;
    }
    static calc_Ecliptic_MeanObliquityCorrection(jt, jt2, jt3, OMs, Ds, DFs, Ms, M1s) {
        var corr = (92025 + 8.9 * jt) * Math.cos(OMs) + (5736 - 3.1 * jt) * Math.cos(-2 * Ds + 2 * DFs + 2 * OMs) + (977 - 0.5 * jt) * Math.cos(2 * DFs + 2 * OMs) + (-895 + 0.5 * jt) * Math.cos(2 * OMs) + (54 - 0.1 * jt) * Math.cos(Ms) - 7 * Math.cos(M1s);
        corr += (224 - 0.6 * jt) * Math.cos(-2 * Ds + Ms + 2 * DFs + 2 * OMs) + 200 * Math.cos(2 * DFs + OMs) + (129 - 0.1 * jt) * Math.cos(M1s + 2 * DFs + 2 * OMs) + (-95 + 0.3 * jt) * Math.cos(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 70 * Math.cos(-2 * Ds + 2 * DFs + OMs);
        corr -= 53 * Math.cos(-M1s + 2 * DFs + 2 * OMs) - 33 * Math.cos(M1s + OMs) + 26 * Math.cos(2 * Ds - M1s + 2 * DFs + 2 * OMs) + 32 * Math.cos(-M1s + OMs) + 27 * Math.cos(M1s + 2 * DFs + OMs) - 24 * Math.cos(-2 * M1s + 2 * DFs + OMs);
        corr += 16 * Math.cos(2 * (Ds + DFs + OMs)) + 13 * Math.cos(2 * (M1s + DFs + OMs)) - 12 * Math.cos(2 * OMs + 2 * DFs + M1s - 2 * Ds) - 10 * Math.cos(OMs + 2 * DFs - M1s) - 8 * Math.cos(2 * Ds - M1s + OMs) + 7 * Math.cos(2 * (OMs + DFs + Ms - Ds)) + 9 * Math.cos(Ms + OMs);
        corr += 7 * Math.cos(OMs + M1s - 2 * Ds) + 6 * Math.cos(OMs - Ms) + 5 * Math.cos(OMs + 2 * DFs - M1s + 2 * Ds) + 3 * Math.cos(2 * OMs + 2 * DFs + M1s + 2 * Ds) - 3 * Math.cos(2 * OMs + 2 * DFs + Ms) + 3 * Math.cos(2 * OMs + 2 * DFs - Ms) + 3 * Math.cos(OMs + 2 * DFs + 2 * Ds);
        corr -= 3 * Math.cos(2 * (OMs + DFs + M1s - Ds)) - 3 * Math.cos(OMs + 2 * DFs + M1s - 2 * Ds) + 3 * Math.cos(OMs - 2 * M1s + 2 * Ds) + 3 * Math.cos(OMs + 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs - Ms - 2 * Ds) + 3 * Math.cos(OMs - 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs + 2 * M1s);
        corr *= 0.0001 / 3600; // arcsec to degrees
        return corr;
    }
    static toGasDegrees(date) {
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
        //			    var i : number= (gms / 360.0);
        //	            if (i < 0) i -= 1;
        //	            gms -= (0 | i) * 360.0;
        gas = MeeusEngine.normalize(gas);
        return gas;
    }
    //#endregion Sidereal Time helpers
    //#region EqToHor transformation helpers
    static correctForRefraction(altitude) {
        var true_alt = altitude;
        if (true_alt instanceof Angle)
            true_alt = true_alt.degrees;
        var R = 1.0 / Math.tan((true_alt + (7.31 / (true_alt + 4.4))) * MeeusEngine.D2R); // In minutes of arc
        R -= 0.06 * Math.sin(((14.7 * R / 60.0) + 13.0) * MeeusEngine.D2R);
        R /= 60.0; // In degrees
        //				console.log('correctForRefraction: ' + (true_alt + R));
        return Angle.fromDegrees(true_alt + R);
    }
    static uncorrectRefraction(altitude) {
        var true_alt = altitude;
        if (true_alt instanceof Angle)
            true_alt = true_alt.degrees;
        var R = 1.0 / Math.tan((true_alt + (7.31 / (true_alt + 4.4))) * MeeusEngine.D2R); // In minutes of arc
        R -= 0.06 * Math.sin(((14.7 * R / 60.0) + 13.0) * MeeusEngine.D2R);
        R /= 60.0; // In degrees
        //				console.log('uncorrectForRefraction: ' + (true_alt - R));
        return true_alt - R;
    }
    static toTopocentric(hc) {
        var alt_geoc = hc;
        if (alt_geoc instanceof Angle)
            alt_geoc = alt_geoc.degrees;
        var dist = 1e10;
        var corr = Math.atan(Math.cos(alt_geoc * MeeusEngine.D2R) / (dist - Math.sin(alt_geoc * MeeusEngine.D2R)));
        var alt_topoc = alt_geoc - (corr * MeeusEngine.R2D);
        //			    console.log('toTopocentric: ' + alt_topoc);
        return MeeusEngine.correctForRefraction(alt_topoc);
    }
    static toGeocentric(hc) {
        var alt_topo = hc;
        if (alt_topo instanceof Angle)
            alt_topo = alt_topo.degrees;
        alt_topo = MeeusEngine.uncorrectRefraction(alt_topo);
        var dist = 1e10;
        var corr = Math.atan(Math.cos(alt_topo * MeeusEngine.D2R) / (dist - Math.sin(alt_topo * MeeusEngine.D2R)));
        var alt_geoc = alt_topo + corr * MeeusEngine.R2D;
        //				console.log('toGeocentric: ' + alt_geoc);
        return Angle.fromDegrees(alt_geoc);
    }
    static toUnitVector(ec) {
        var dec0 = ec.declination.radians;
        var ra0 = ec.rightAscension.radians;
        var res = [];
        res.push(Math.cos(dec0) * Math.cos(ra0));
        res.push(Math.cos(dec0) * Math.sin(ra0));
        res.push(Math.sin(dec0));
        return res;
    }
    static fromUnitVector(uv) {
        var ra = Math.atan2(uv[1], uv[0]);
        var dec = Math.asin(uv[2]);
        return new EquatorialCoordinates(Angle.fromRadians(ra), Angle.fromRadians(dec));
    }
    static precesionMatrixParams(date) {
        var jt = date.centuriesSinceJ2000;
        var jt2 = jt * jt;
        var jt3 = jt2 * jt;
        var xsi = 0.011180860865024398 * jt
            + 0.0000014635555405334672 * jt2
            + Math.pow(8.725676632609429, -8) * jt3;
        var zeta = 0.011180860865024398 * jt
            + 0.000005307158404369869 * jt2
            + Math.pow(8.825063437236882, -8) * jt3;
        var theta = 0.009717173455169672 * jt
            + 0.000002068457570453835 * jt2
            + Math.pow(2.0281210721855223, -7) * jt3;
        //				
        //				console.log('var xsi = ' + Angle.fromDegrees(0, 0, 2306.2181).radians + ' * jt'); 
        //				console.log('        + ' + Angle.fromDegrees(0, 0, 0.30188).radians + ' * jt2');
        //				console.log('        +' + Angle.fromDegrees(0, 0, 0.017998).radians + ' * jt3;');
        //				
        //				console.log('var zeta = ' + Angle.fromDegrees(0, 0, 2306.2181).radians + ' * jt');
        //				console.log('         + ' + Angle.fromDegrees(0, 0, 1.09468).radians + ' * jt2');
        //				console.log('         + ' + Angle.fromDegrees(0, 0, 0.018203).radians + ' * jt3;');
        //				
        //				console.log('var theta = ' + Angle.fromDegrees(0, 0, 2004.3109).radians + ' * jt');
        //				console.log('          + ' + Angle.fromDegrees(0, 0, 0.42665).radians + ' * jt2');
        //				console.log('          + ' + Angle.fromDegrees(0, 0, 0.041833).radians + ' * jt3;');
        ////				
        //				var xsi = Angle.fromDegrees(0, 0, 2306.2181).radians * jt 
        //						+ Angle.fromDegrees(0, 0, 0.30188).radians * jt2
        //						+ Angle.fromDegrees(0, 0, 0.017998).radians * jt3;
        //				var zeta = Angle.fromDegrees(0, 0, 2306.2181).radians * jt
        //				         + Angle.fromDegrees(0, 0, 1.09468).radians * jt2
        //						 + Angle.fromDegrees(0, 0, 0.018203).radians * jt3;
        //				var theta = Angle.fromDegrees(0, 0, 2004.3109).radians * jt
        //				          - Angle.fromDegrees(0, 0, 0.42665).radians * jt2
        //						  - Angle.fromDegrees(0, 0, 0.041833).radians * jt3;
        //					
        // precession parameters				
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
    }
    static determinant3x3(m) {
        var res = m[0][0] * m[1][1] * m[2][2]
            - m[0][0] * m[1][2] * m[2][1]
            - m[0][1] * m[1][0] * m[2][2]
            + m[0][1] * m[1][2] * m[2][0]
            + m[0][2] * m[1][0] * m[2][1]
            - m[0][2] * m[1][1] * m[2][0];
        return res;
    }
    static inverse3x3(m) {
        var det = MeeusEngine.determinant3x3(m);
        return [[
                (m[1][1] * m[2][2] - m[1][2] * m[2][1]) / det,
                (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det,
                (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det
            ], [
                (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det,
                (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det,
                (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det
            ], [
                (m[1][0] * m[2][1] - m[1][1] * m[2][0]) / det,
                (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / det,
                (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / det
            ]
        ];
    }
    static inversePrecesionMatrixAt(date) {
        var params = MeeusEngine.precesionMatrixParams(date);
        return [
            [params.p00, params.p10, params.p20],
            [params.p01, params.p11, params.p21],
            [params.p02, params.p12, params.p22]
        ];
    }
    static precesionMatrixAt(date) {
        var params = MeeusEngine.precesionMatrixParams(date);
        return [
            [params.p00, params.p01, params.p02],
            [params.p10, params.p11, params.p12],
            [params.p20, params.p21, params.p22]
        ];
    }
    static matrixTimesMatrix(P0, P1) {
        return [
            [
                P0[0][0] * P1[0][0] + P0[0][1] * P1[1][0] + P0[0][2] * P1[2][0],
                P0[0][0] * P1[0][1] + P0[0][1] * P1[1][1] + P0[0][2] * P1[2][1],
                P0[0][0] * P1[0][2] + P0[0][1] * P1[1][2] + P0[0][2] * P1[2][2]
            ], [
                P0[1][0] * P1[0][0] + P0[1][1] * P1[1][0] + P0[1][2] * P1[2][0],
                P0[1][0] * P1[0][1] + P0[1][1] * P1[1][1] + P0[1][2] * P1[2][1],
                P0[1][0] * P1[0][2] + P0[1][1] * P1[1][2] + P0[1][2] * P1[2][2]
            ], [
                P0[2][0] * P1[0][0] + P0[2][1] * P1[1][0] + P0[2][2] * P1[2][0],
                P0[2][0] * P1[0][1] + P0[2][1] * P1[1][1] + P0[2][2] * P1[2][1],
                P0[2][0] * P1[0][2] + P0[2][1] * P1[1][2] + P0[2][2] * P1[2][2]
            ]
        ];
    }
    static matrixTimesVector(P, p0) {
        return [
            P[0][0] * p0[0] + P[0][1] * p0[1] + P[0][2] * p0[2],
            P[1][0] * p0[0] + P[1][1] * p0[1] + P[1][2] * p0[2],
            P[2][0] * p0[0] + P[2][1] * p0[1] + P[2][2] * p0[2]
        ];
    }
    static fromJ2000(ec, date) {
        var p0 = MeeusEngine.toUnitVector(ec);
        var P = MeeusEngine.precesionMatrixAt(date);
        var p1 = MeeusEngine.matrixTimesVector(P, p0);
        return MeeusEngine.fromUnitVector(p1);
    }
    static toJ2000(ec, date) {
        var p1 = MeeusEngine.toUnitVector(ec);
        var invP = MeeusEngine.inversePrecesionMatrixAt(date);
        var p0 = MeeusEngine.matrixTimesVector(invP, p1);
        return MeeusEngine.fromUnitVector(p0);
    }
    static toEpoch(ec, date) {
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
        //var C = (Math.sin(theta) * Math.cos(dec) * Math.cos(ra + zeta)) - (Math.cos(theta) * Math.sin(dec));
        var raJNow = Math.atan2(A, B) + z;
        if (raJNow < 0.0)
            raJNow += MeeusEngine.PI2;
        else if (raJNow > MeeusEngine.PI2)
            raJNow -= MeeusEngine.PI2;
        raJNow *= MeeusEngine.R2D;
        var decJNow = Math.acos(Math.sqrt((A * A) + (B * B))); // Math.asin(C);		   
        if ((decJNow * dec) < 0.0)
            decJNow = -decJNow;
        decJNow *= MeeusEngine.R2D;
        return new EquatorialCoordinates(Angle.fromDegrees(raJNow), Angle.fromDegrees(decJNow));
    }
    //#endregion EqToHor transformation helpers
    //#region Sunrise/Sunset calculation helpers
    static calc_SunriseOrSunset_UTC(isSunrise, jd, location, twilight) {
        var jt = jd.centuriesSinceJ2000;
        var eqTime = MeeusEngine.calc_EquationOfTime(jt);
        var solarDec = MeeusEngine.calc_Sun_Declination(jt);
        var hourAngle = MeeusEngine.calcHourAngleSunriseOrSunset(isSunrise, location.latitude.degrees, solarDec, twilight);
        var delta = location.longitude.degrees + MeeusEngine.R2D * (hourAngle);
        var utcMinutes = 720 - (4.0 * delta) - eqTime; // in minutes
        return utcMinutes;
    }
    static prepareJd(date) {
        var jd;
        if (date instanceof Date) {
            jd = UtcDate.fromDate(date);
        }
        else if (date instanceof UtcDate) {
            jd = date;
        }
        else {
            throw 'date';
        }
        return jd;
    }
    static calc_SunriseOrSunset(isSunrise, jd, location, twilight) {
        var date = jd.toDate();
        var JD = new UtcDate(UtcDate.toUtcDays(date.getFullYear(), date.getMonth(), date.getDate())); //jd.days;
        var timezone = -date.getTimezoneOffset() / 60;
        var dst = MeeusEngine.isDaylightSavingsTime(date);
        var latitude = location.latitude.degrees;
        var longitude = location.longitude.degrees;
        var timeUTC = MeeusEngine.calc_SunriseOrSunset_UTC(isSunrise, JD, location, twilight);
        var newTimeUTC = MeeusEngine.calc_SunriseOrSunset_UTC(isSunrise, JD.addMinutes(timeUTC), location, twilight);
        if (typeof (newTimeUTC) == 'number') {
            var timeLocal = newTimeUTC;
            // timeLocal += ((dst) ? 60.0 : 0.0);
            if ((timeLocal >= 0.0) && (timeLocal < 1440.0)) {
                return JD.addMinutes(timeLocal);
            }
            else {
                var jday = JD.days;
                var increment = ((timeLocal < 0) ? 1 : -1);
                while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
                    timeLocal += increment * 1440.0;
                    jday -= increment;
                }
                return new UtcDate(jday).addMinutes(timeLocal);
            }
        }
        else {
            var doy = MeeusEngine.calcDoyFromJD(JD.days);
            if (((latitude > 66.4) && (doy > 79) && (doy < 267)) || ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {
                var jdy; //previous sunrise/next sunset
                if (isSunrise) {
                    jdy = MeeusEngine.calc_JDofNextPrevRiseSet(0, isSunrise, JD.days, latitude, longitude, timezone, dst);
                }
                else {
                    jdy = MeeusEngine.calc_JDofNextPrevRiseSet(1, isSunrise, JD.days, latitude, longitude, timezone, dst);
                }
                // here return
                throw 'notimplementedyet';
            }
            else {
                if (isSunrise == true) {
                    jdy = MeeusEngine.calc_JDofNextPrevRiseSet(1, isSunrise, JD.days, latitude, longitude, timezone, dst);
                }
                else {
                    jdy = MeeusEngine.calc_JDofNextPrevRiseSet(0, isSunrise, JD.days, latitude, longitude, timezone, dst);
                }
                // here return
                throw 'notimplementedyet';
            }
        }
    }
    static calc_JDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz, dst) {
        var julianday = JD;
        var increment = ((next) ? 1.0 : -1.0);
        var time = MeeusEngine.calc_SunriseOrSunset_UTC(rise, julianday, latitude, longitude);
        while (typeof (time) != 'number') {
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
    }
    static isLeapYear(yr) {
        return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
    }
    static calcDoyFromJD(jd) {
        var z = Math.floor(jd + 0.5);
        var f = (jd + 0.5) - z;
        if (z < 2299161) {
            var A = z;
        }
        else {
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
    }
    static calcSunRa(jt, eclipticObliquityCorrection, sunApparentLong) {
        var e = eclipticObliquityCorrection || MeeusEngine.calc_Ecliptic_ObliquityCorrection(jt);
        var lambda = sunApparentLong || MeeusEngine.calc_Sun_ApparentLong(jt);
        var tananum = (Math.cos(MeeusEngine.D2R * e) * Math.sin(MeeusEngine.D2R * lambda));
        var tanadenom = (Math.cos(MeeusEngine.D2R * lambda));
        var alpha_Deg = MeeusEngine.R2D * Math.atan2(tananum, tanadenom);
        return alpha_Deg; // in degrees
    }
    static calc_Sun_Declination(jt, eclipticObliquityCorrection, sunApparentLong) {
        var e = eclipticObliquityCorrection || MeeusEngine.calc_Ecliptic_ObliquityCorrection(jt);
        var lambda = sunApparentLong || MeeusEngine.calc_Sun_ApparentLong(jt);
        var sint = Math.sin(MeeusEngine.D2R * e) * Math.sin(MeeusEngine.D2R * lambda);
        var delta_Deg = MeeusEngine.R2D * Math.asin(sint);
        return delta_Deg; // in degrees
    }
    static calc_EquationOfTime(jt, ecliptic_ObliquityCorrection, sunMeanLongitude, earthOrbitEcc, sunMeanAnomaly) {
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
    }
    static getHRadians(twilight) {
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
    }
    static calcHourAngleSunriseOrSunset(isSunrise, lat, solarDec, twilight) {
        var latRad = MeeusEngine.D2R * lat;
        var sdRad = MeeusEngine.D2R * solarDec;
        var hrad = MeeusEngine.getHRadians(twilight);
        var HAarg = (Math.cos(MeeusEngine.D2R * hrad) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
        var HA_Rad = Math.acos(HAarg);
        return isSunrise ? HA_Rad : -HA_Rad; // in radians (for sunset, use -HA)
    }
    /*
        * based: http://stackoverflow.com/questions/11887934/check-if-daylight-saving-time-is-in-effect-and-if-it-is-for-how-many-hours
        */
    static isDaylightSavingsTime(date) {
        var jan = new Date(date.getFullYear(), 0, 1);
        var jul = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    }
    static calcAzEl(T, localtime, latitude, longitude, zone) {
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
        }
        else if (csz < -1.0) {
            csz = -1.0;
        }
        var zenith = MeeusEngine.R2D * (Math.acos(csz));
        var azDenom = (Math.cos(MeeusEngine.D2R * (latitude)) * Math.sin(MeeusEngine.D2R * (zenith)));
        if (Math.abs(azDenom) > 0.001) {
            var azRad = ((Math.sin(MeeusEngine.D2R * (latitude)) * Math.cos(MeeusEngine.D2R * (zenith))) - Math.sin(MeeusEngine.D2R * (theta))) / azDenom;
            if (Math.abs(azRad) > 1.0) {
                if (azRad < 0) {
                    azRad = -1.0;
                }
                else {
                    azRad = 1.0;
                }
            }
            var azimuth = 180.0 - MeeusEngine.R2D * (Math.acos(azRad));
            if (hourAngle > 0.0) {
                azimuth = -azimuth;
            }
        }
        else {
            if (latitude > 0.0) {
                azimuth = 180.0;
            }
            else {
                azimuth = 0.0;
            }
        }
        if (azimuth < 0.0) {
            azimuth += 360.0;
        }
        var exoatmElevation = 90.0 - zenith;
        // Atmospheric Refraction correction
        if (exoatmElevation > 85.0) {
            var refractionCorrection = 0.0;
        }
        else {
            var te = Math.tan(MeeusEngine.D2R * (exoatmElevation));
            if (exoatmElevation > 5.0) {
                var refractionCorrection = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
            }
            else if (exoatmElevation > -0.575) {
                var refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711)));
            }
            else {
                var refractionCorrection = -20.774 / te;
            }
            refractionCorrection = refractionCorrection / 3600.0;
        }
        var solarZen = zenith - refractionCorrection;
        return (azimuth);
    }
}
MeeusEngine.PI = Math.PI;
MeeusEngine.PI2 = 2.0 * Math.PI;
MeeusEngine.D2R = Math.PI / 180.0;
MeeusEngine.R2D = 180.0 / Math.PI;
MeeusEngine.MinsPerAU = 8.3168775;
MeeusEngine.TaiToTtOffsetSeconds = 32.184;
// taken from http://maia.usno.navy.mil/ser7/tai-utc.dat
MeeusEngine.LeapSeconds = [
    {
        utcdays: 2457204.5,
        taiutc: { p1: 36, p2: 41317, p3: 0 }
    }, {
        utcdays: 2456109.5,
        taiutc: { p1: 35, p2: 41317, p3: 0 }
    }, {
        utcdays: 2454832.5,
        taiutc: { p1: 34, p2: 41317, p3: 0 }
    }, {
        utcdays: 2453736.5,
        taiutc: { p1: 33, p2: 41317, p3: 0 }
    }, {
        utcdays: 2451179.5,
        taiutc: { p1: 32, p2: 41317, p3: 0 }
    }, {
        utcdays: 2450630.5,
        taiutc: { p1: 31, p2: 41317, p3: 0 }
    }, {
        utcdays: 2450083.5,
        taiutc: { p1: 30, p2: 41317, p3: 0 }
    }, {
        utcdays: 2449534.5,
        taiutc: { p1: 29, p2: 41317, p3: 0 }
    }, {
        utcdays: 2449169.5,
        taiutc: { p1: 28, p2: 41317, p3: 0 }
    }, {
        utcdays: 2448804.5,
        taiutc: { p1: 27, p2: 41317, p3: 0 }
    }, {
        utcdays: 2448257.5,
        taiutc: { p1: 26, p2: 41317, p3: 0 }
    }, {
        utcdays: 2447892.5,
        taiutc: { p1: 25, p2: 41317, p3: 0 }
    }, {
        utcdays: 2447161.5,
        taiutc: { p1: 24, p2: 41317, p3: 0 }
    }, {
        utcdays: 2446247.5,
        taiutc: { p1: 23, p2: 41317, p3: 0 }
    }, {
        utcdays: 2445516.5,
        taiutc: { p1: 22, p2: 41317, p3: 0 }
    }, {
        utcdays: 2445151.5,
        taiutc: { p1: 21, p2: 41317, p3: 0 }
    }, {
        utcdays: 2444786.5,
        taiutc: { p1: 20, p2: 41317, p3: 0 }
    }, {
        utcdays: 2444239.5,
        taiutc: { p1: 19, p2: 41317, p3: 0 }
    }, {
        utcdays: 2443874.5,
        taiutc: { p1: 18, p2: 41317, p3: 0 }
    }, {
        utcdays: 2443509.5,
        taiutc: { p1: 17, p2: 41317, p3: 0 }
    }, {
        utcdays: 2443144.5,
        taiutc: { p1: 16, p2: 41317, p3: 0 }
    }, {
        utcdays: 2442778.5,
        taiutc: { p1: 15, p2: 41317, p3: 0 }
    }, {
        utcdays: 2442413.5,
        taiutc: { p1: 14, p2: 41317, p3: 0 }
    }, {
        utcdays: 2442048.5,
        taiutc: { p1: 13, p2: 41317, p3: 0 }
    }, {
        utcdays: 2441683.5,
        taiutc: { p1: 12, p2: 41317, p3: 0 }
    }, {
        utcdays: 2441499.5,
        taiutc: { p1: 11, p2: 41317, p3: 0 }
    }, {
        utcdays: 2441317.5,
        taiutc: { p1: 10, p2: 41317, p3: 0 }
    }, {
        utcdays: 2439887.5,
        taiutc: { p1: 4.2131700, p2: 39126, p3: 0.002592 }
    }, {
        utcdays: 2439126.5,
        taiutc: { p1: 4.3131700, p2: 39126, p3: 0.002592 }
    }, {
        utcdays: 2439004.5,
        taiutc: { p1: 3.8401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438942.5,
        taiutc: { p1: 3.7401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438820.5,
        taiutc: { p1: 3.6401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438761.5,
        taiutc: { p1: 3.5401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438639.5,
        taiutc: { p1: 3.4401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438486.5,
        taiutc: { p1: 3.3401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438395.5,
        taiutc: { p1: 3.2401300, p2: 38761, p3: 0.001296 }
    }, {
        utcdays: 2438334.5,
        taiutc: { p1: 1.9458580, p2: 37665, p3: 0.0011232 }
    }, {
        utcdays: 2437665.5,
        taiutc: { p1: 1.8458580, p2: 37665, p3: 0.0011232 }
    }, {
        utcdays: 2437512.5,
        taiutc: { p1: 1.3728180, p2: 37300, p3: 0.001296 }
    }, {
        utcdays: 2437300.5,
        taiutc: { p1: 1.4228180, p2: 37300, p3: 0.001296 }
    }
];
//# sourceMappingURL=meeusEngine.js.map