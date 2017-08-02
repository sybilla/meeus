import * as meeus from '../index';

describe('Parsing', () => {
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

    it("Parse Default Hour Pattern", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i]));//, "Failed at: " + i
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
    it("Parse Default Degree Patterns", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i])); //, "Failed at: " + i
        }
    });
});


describe("Parsing", () => {
    var expected = meeus.Angle.fromRadians(18);
    var samples = [
        "18",
        "+18"
    ];

    it("Parse Default Radian Patterns", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i])); //, "Failed at: " + i
        }
    });
});

describe("Parsing", () => {
    var expected = meeus.Angle.fromRadians(18.12);
    var samples = [
        "18.12",
        "18,12",
        "+18.12",
        "+18,12"
    ];

    it("Parse Default Radian-With-Decimals Patterns", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i])); //, "Failed at: " + i
        }
    });
});


describe("Parsing", () => {
    var expected = meeus.Angle.fromDegrees(18, 4, 20.12);
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
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i])); // , "Failed at: " + i
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
        for (let i = 0, l = samples.length; i < l; i++) {
            expect(expected).toEqual(meeus.Angle.parse(samples[i])); // , "Failed at: " + i
        }
    });
});
