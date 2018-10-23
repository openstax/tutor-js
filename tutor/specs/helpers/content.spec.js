import { expect } from 'chai';
import _ from 'underscore';

import Helpers from '../../src/helpers/content';

describe('ExerciseHelpers', () =>

  it('converts chapter_sections to numbers', function() {
    expect(Helpers.chapterSectionToNumber([1])).to.equal(100);
    expect(Helpers.chapterSectionToNumber([1, 2])).to.equal(102);
    expect(Helpers.chapterSectionToNumber([1, 0])).to.equal(100);
    expect(Helpers.chapterSectionToNumber([1, 0, 8])).to.equal(10008);
    expect(Helpers.chapterSectionToNumber([0, 1])).to.equal(1);
    expect(Helpers.chapterSectionToNumber([31, 88, 42])).to.equal(318842);
    return undefined;
  })
);
