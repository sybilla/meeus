import {expect} from 'chai';
import * as meeus from '../dist/cjs/meeus';
import "mocha";

describe('Parsing', () => {
    var expected = new meeus.EquatorialCoordinates(meeus.Angle.fromHours(18, 4, 20.99), meeus.Angle.fromDegrees(29, 31, 8.9).negative());
    var samples = [
        "18:04:20.99 -29:31:08.9",
        "18 04 20.99 -29 31 08.9",
        "18:04:20.99,-29:31:08.9",
        "18h 04m 20.99s -29d 31m 08.9s",
        "18.07249722222222 -29.519139",
        "18h04m20.99s -29d31m08.9s",
        "18h04m20.99s -29°31'08.9\"",
        "J180420.99-293108.9",
        // "(4.73647670572378 , 1.16495855193126)"
    ];

    it("Parse Default Hour-Degree Patterns", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            let actual = meeus.EquatorialCoordinates.parse(samples[i]);
            
            expect(expected.declination.degreeMilliseconds).to.be.closeTo(actual.declination.degreeMilliseconds, 0.5, "Failed at: " + i);
            expect(expected.rightAscension.degreeMilliseconds).to.be.closeTo(actual.rightAscension.degreeMilliseconds, 0.5, "Failed at: " + i);
        }
    });
});


describe("Parsing", () => {
    var expected = new meeus.EquatorialCoordinates(meeus.Angle.fromHours(18, 4, 20.99), meeus.Angle.fromDegrees(29, 31, 8.9).negative());
    var samples = [
        "d 271:05:14.85 -29:31:08.9",
        "d 271 05 14.85 -29 31 08.9",
        "d 271.08745833333336 -29.519139",
        "271d 05m 14.85s -29d 31m 08.9s",
        "271d05m14.85s -29d31m08.9s",
        "271°05'14.85\" -29°31'08.9\"",
    ];

    // Act & Assert
    it("Parse Default Degree-Degree Patterns", () => {
        for (let i = 0, l = samples.length; i < l; i++) {
            let actual = meeus.EquatorialCoordinates.parse(samples[i]);
            
            expect(expected.declination.degreeMilliseconds).to.be.closeTo(actual.declination.degreeMilliseconds, 0.5, "Failed at: " + i);
            expect(expected.rightAscension.degreeMilliseconds).to.be.closeTo(actual.rightAscension.degreeMilliseconds, 0.5, "Failed at: " + i);
        }
    });
});