import * as Helpers from '../../src/helpers/content';

describe('ExerciseHelpers', () =>

  it('converts chapter_sections to numbers', function() {
    expect(Helpers.chapterSectionToNumber([1])).toEqual(100);
    expect(Helpers.chapterSectionToNumber([1, 2])).toEqual(102);
    expect(Helpers.chapterSectionToNumber([1, 0])).toEqual(100);
    expect(Helpers.chapterSectionToNumber([1, 0, 8])).toEqual(10008);
    expect(Helpers.chapterSectionToNumber([0, 1])).toEqual(1);
    expect(Helpers.chapterSectionToNumber([31, 88, 42])).toEqual(318842);
  })
);
