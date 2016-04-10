/// <reference path="../../meeus/scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../src/coordinatesystems/eclipticalcoordinates.ts" />
/// <reference path="../../src/coordinatesystems/equatorialcoordinates.ts" />
/// <reference path="../../src/coordinatesystems/geographiccoordinates.ts" />
/// <reference path="../../src/datetime/utcdate.ts" />
/// <reference path="../../src/objects/sun.ts" />
/// <reference path="../../src/coordinatesystems/horizontalcoordinates.ts" />
/// <reference path="../../src/angle.ts" />
/// <reference path="../../src/objects/moon.ts" />
/// <reference path="../../src/core/meeusengine.ts" />
/// <reference path="../../src/datetime/taidate.ts" />
/// <reference path="../../src/datetime/ttdate.ts" />
/// <reference path="../../src/datetime/hjddate.ts" />
/// <reference path="../../src/datetime/siderealtimes.ts" />

//describe("Normalize", () => {
//    var expected = meeus.Angle.fromDegrees(12);
//    var samples = [
//        meeus.Angle.fromDegrees(12),
//        meeus.Angle.fromDegrees(372),
//        meeus.Angle.fromDegrees(732),
//        meeus.Angle.fromDegrees(-348),
//        meeus.Angle.fromDegrees(-708)
//    ];

//    it("Normalize_Periodic_Default_Range_0_360", () => {
//        for (let i = 0; i < samples.length; i++) {
//            expect(expected).toEqual(samples[i].normalize());
//        }
//    });
//});

//describe("Normalize", () => {
//    var expected = expected = meeus.Angle.fromDegrees(12.119);
//    var oneTenMilionthPart = 1e-7;
//    var samples = [
//        meeus.Angle.fromDegrees(12.119),
//        meeus.Angle.fromDegrees(372.119),
//        meeus.Angle.fromDegrees(732.119),
//        meeus.Angle.fromDegrees(-348.119),
//        meeus.Angle.fromDegrees(-708.119)
//    ];

//    it("Normalize_Periodic_Default_Range_0_360", () => {
//        for (let i = 0; i < samples.length; i++) {
//            var s = samples[i];
//            expect(expected).toBe((
//                oneTenMilionthPart - s.normalize(0, meeus.AngleNormalization.Periodic).degrees) < oneTenMilionthPart
//            );
//        }
//    });
//});

describe("Parsing", () => {
    var expected = meeus.Angle.fromHours(18, 4, 20);
    var samples = [
        "18h 04m 20s",
        "18h04m20s",
        "18h 04m 20",
        "18h04m20",
        "18h 4m 20",
        "18h4m20",
        "+18h 04m 20s",
        "+18h04m20s",
        "+18h 04m 20",
        "+18h04m20",
        "+18h 4m 20",
        "+18h4m20",
        "J180420"
    ];

    it("Parse default hour pattern", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromHours(18, 4, 20.12);
    var samples = [
        "18h 04m 20.12s",
        "18h04m20.12s",
        "18h 04m 20.12",
        "18h04m20.12",
        "18h 4m 20.12",
        "18h4m20.12",
        "+18h 04m 20.12s",
        "+18h04m20.12s",
        "+18h 04m 20.12",
        "+18h04m20.12",
        "+18h 4m 20.12",
        "+18h4m20.12",
        "J180420.12",
        "J180420,12"
    ];

    it("Parse_Default_Hour_With_Decimals_Patterns", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromDegrees(18, 4, 20);
    var samples = [
        "18: 04: 20",
        "18:04:20",
        "18d 04m 20s",
        "18d04m20s",
        "18d 04m 20",
        "18d04m20",
        "18 04 20",
        "18 4 20",
        "18°04'20\"",
        "18° 04' 20\"",
        "18*04'20\"",
        "18* 04' 20\"",
        "18°04'20",
        "18° 04' 20",
        "18*04'20",
        "18* 04' 20",
        "+18: 04: 20",
        "+18:04:20",
        "+18d 04m 20s",
        "+18d04m20s",
        "+18d 04m 20",
        "+18d04m20",
        "+18 04 20",
        "+18 4 20",
        "+18°04'20\"",
        "+18° 04' 20\"",
        "+18*04'20\"",
        "+18* 04' 20\"",
        "+18°04'20",
        "+18° 04' 20",
        "+18*04'20",
        "+18* 04' 20",
        "180420",
        "+180420"
    ];

    // Act & Assert
    it("Parse_Default_Degree_Patterns", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromDegrees(18, 4, 20);
    var samples = [
        "18: 04: 20.12",
        "18:04:20.12",
        "18d 04m 20.12s",
        "18d04m20.12s",
        "18d 04m 20.12",
        "18d04m20.12",
        "18 04 20.12",
        "18 4 20.12",
        "18°04'20.12\"",
        "18° 04' 20.12\"",
        "18*04'20.12\"",
        "18* 04' 20.12\"",
        "18°04'20.12",
        "18° 04' 20.12",
        "18*04'20.12",
        "18* 04' 20.12",
        "+18: 04: 20.12",
        "+18:04:20.12",
        "+18d 04m 20.12s",
        "+18d04m20.12s",
        "+18d 04m 20.12",
        "+18d04m20.12",
        "+18 04 20.12",
        "+18 4 20.12",
        "+18°04'20.12\"",
        "+18° 04' 20.12\"",
        "+18*04'20.12\"",
        "+18* 04' 20.12\"",
        "+18°04'20.12",
        "+18° 04' 20.12",
        "+18*04'20.12",
        "+18* 04' 20.12",
        "180420.12",
        "+180420.12",
        "180420,12",
        "+180420,12"
    ];

    // Act & Assert
    it("Parse_Default_Degree_With_Decimals_Patterns", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromRadians(18);
    var samples = [
        "18",
        "+18"
    ];

    it("Parse_Default_Radian_Patterns", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromRadians(18);
    var samples = [
        "18.12",
        "18,12",
        "+18.12",
        "+18,12"
    ];

    it("Parse_Default_Radian_With_Decimals_Patterns", () => {
        for (let i = 0; i < samples.length; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));
        }
    });
});