import Exercise from 'shared/helpers/exercise';

describe('Exercise Helper', function() {

  afterEach(() => Exercise.setOSWebURL('https://oscms.openstax.org'));

  it('calculates trouble url', () =>
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd',
      project: 'tutor',
      exerciseId: '22@22',
      chapter_section: [1, 2],
      title: 'Intro to Physics',
    })).toEqual(`${Exercise.ERRATA_FORM_URL}?source=tutor&location=22%4022%201.2%20Intro%20to%20Physics&book=Biology`)
  );

  it('skips missing parts', () =>
    expect(Exercise.troubleUrl({
      chapter_section: [1, 2],
      title: 'Intro to Physics',
    })).toEqual(`${Exercise.ERRATA_FORM_URL}?location=1.2%20Intro%20to%20Physics`)
  );


  return it('can set the errata url', function() {
    Exercise.setOSWebURL('');
    expect(Exercise.ERRATA_FORM_URL).toEqual('https://oscms.openstax.org/errata/form');
    Exercise.setOSWebURL('https://my-crazy-url');
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd',
      project: 'tutor',
      exerciseId: '22@22',
      chapter_section: [1, 2],
      title: 'Intro to Physics',
    })).toEqual('https://my-crazy-url/errata/form?source=tutor&location=22%4022%201.2%20Intro%20to%20Physics&book=Biology');
  });
});
