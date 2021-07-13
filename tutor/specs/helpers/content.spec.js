import * as Helpers from '../../src/helpers/content';

describe('ExerciseHelpers', () => {

    it('converts chapter_sections to numbers', () => {
        expect(Helpers.chapterSectionToNumber([1])).toEqual(100);
        expect(Helpers.chapterSectionToNumber([1, 2])).toEqual(102);
        expect(Helpers.chapterSectionToNumber([1, 0])).toEqual(100);
        expect(Helpers.chapterSectionToNumber([1, 0, 8])).toEqual(10008);
        expect(Helpers.chapterSectionToNumber([0, 1])).toEqual(1);
        expect(Helpers.chapterSectionToNumber([31, 88, 42])).toEqual(318842);
    });

    it('extracts cnx ids', () => {
        expect(Helpers.extractOxId(
            'this is a uuid without ver d3aa88e2-c754-41e0-8ba6-4198a34aa0a2, it no match'
        )).toBeNull();

        expect(Helpers.extractOxId(
            'blaha at d3aa88e2-c754-41e0-8ba6-4198a34aa0a2@1; is good'
        )).toEqual('d3aa88e2-c754-41e0-8ba6-4198a34aa0a2@1');

        expect(Helpers.extractOxId(
            'https://archive.cnx.org/contents/405335a3-7cff-4df2-a9ad-29062a4af261@7.3:95497188-90c9-4aff-9446-222d4d6f9743@6.3'
        )).toEqual('405335a3-7cff-4df2-a9ad-29062a4af261@7.3');

    });

});
