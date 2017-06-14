import CourseInfo from '../../../src/models/course/information';

describe('Course Information lookup', function() {

  it('returns info for a valid appearance_code', function() {
    expect(CourseInfo.forAppearanceCode('college_biology')).to.deep.equal({
      title: 'College Biology',
      subject: 'Biology',
      bp_doc: 'biology',
    });
    return undefined;
  });

  it('returns a default values for unknown codes', function() {
    expect(CourseInfo.forAppearanceCode('yo_yo_yo')).to.deep.equal({
      title: 'Yo Yo Yo',
      subject: '',
    });
    return undefined;
  });

  it('calculates url for best practices doc', () => {
    expect(CourseInfo.bestPracticesDocumentURLFor('bad')).toEqual('')
    expect(CourseInfo.bestPracticesDocumentURLFor('college_biology')).toEqual(
      'https://s3-us-west-2.amazonaws.com/openstax-assets/oscms-prodcms/media/documents/oxt-biology-best-practices.pdf'
    )
  });
});
