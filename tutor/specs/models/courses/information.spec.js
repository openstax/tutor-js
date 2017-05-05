import CourseInfo from '../../../src/models/course/information';

describe('Course Information lookup', function() {

  it('returns info for a valid appearance_code', function() {
    expect(CourseInfo.forAppearanceCode('college_biology')).to.deep.equal({
      title: 'College Biology',
      subject: 'Biology',
    });
    return undefined;
  });

  return it('returns a default values for unknown codes', function() {
    expect(CourseInfo.forAppearanceCode('yo_yo_yo')).to.deep.equal({
      title: 'Yo Yo Yo',
      subject: '',
    });
    return undefined;
  });
});
