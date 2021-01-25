import { isFunction } from 'lodash';
import Analytics from '../../src/helpers/analytics';
import Courses from '../../src/models/courses';
import { bootstrapCoursesList } from '../courses-test-data';
import ReferenceBookNode from '../../src/models/reference-book/node';


function mockGa(name = 'tutor') {
  const ga = jest.fn( (a) => {
    if (isFunction(a)) { a(ga); }
  });
  ga.getAll = jest.fn(() => [ ga ]);

  ga.get = (arg) => { // eslint-disable-next-line no-console
    if (arg !=='name') { console.warn(`unknown get for ${name}`); }
    return name;
  };
  return ga;
}

describe('Analytics', function() {
  let ga;
  let COURSE;

  beforeEach(function() {
    ga = mockGa();
    Analytics.setGa(ga);
    COURSE = bootstrapCoursesList().get(1);
    COURSE.ecosystem_id = 991;
    ga.mockReset();
  });

  afterEach(() => Analytics.setGa(undefined));

  it('sets page view with unknown route events', () => {
    Analytics.onNavigation('/bad/courses/1/list');
    expect(ga).toHaveBeenCalledWith('tutor.send', 'pageview', '/not-found/bad/courses/1/list');
  });

  it('skips sending pageviews if ga isn\'t present', function() {
    Analytics.setGa(undefined);
    Analytics.onNavigation('/course/1');
    expect(ga).not.toHaveBeenCalled();
  });

  it('sends the same commands to all trackers', function() {
    // Set up a mock GA function/object
    const secondGa = mockGa('GA2');
    secondGa.getAll.mockImplementation(() => [ga, secondGa]);

    Analytics.setGa(secondGa);

    // Fire off a tracking event and then check that it went to both trackers
    Analytics.sendEvent('blah', 'bar', { label: 'baz', value: 'one' });


    Analytics.onNavigation('/course/1');
    ['tutor', 'GA2'].forEach((name) => {
      expect(secondGa).toHaveBeenCalledWith(`${name}.send`, 'event', 'blah', 'bar', 'baz', 'one');
      expect(secondGa).toHaveBeenCalledWith(`${name}.send`, 'event', 'blah', 'bar', 'baz', 'one');

      expect(secondGa).toHaveBeenCalledWith(`${name}.set`, 'page', '/student/dashboard/1');
      expect(secondGa).toHaveBeenCalledWith(`${name}.send`, 'pageview', undefined);
    });

  });

  it('records custom dimension', () => {
    Analytics.onNavigation('/course/1');
    expect(ga).toHaveBeenCalledWith('tutor.set', 'dimension1', COURSE.appearance_code);
  });

  it('translates reference-view sections', () => {
    const book = Courses.get(COURSE.id).referenceBook;
    book.children.push(new ReferenceBookNode({ id: 1, chapter_section: '2', type: 'chapter' }));
    book.children[0].children.push(
      new ReferenceBookNode({ id: 1234, chapter_section: '2.2', type: 'page' })
    );
    Analytics.onNavigation('/book/1/page/1234');
    expect(ga).toHaveBeenCalledWith('tutor.set', 'page',
      '/reference-view/1/section/2.2',
    );
  });

  it('translates known urls when sending', function() {
    const c = '/course/1';
    const tests = {
      [c]:                                   '/student/dashboard/1',
      [`${c}/practice`]:                     '/student/practice/1',
      [`${c}/guide`]:                        '/student/performance-forecast/1',
      [`${c}/t/month/2011-11-11`]:           '/teacher/calendar/1',
      [`${c}/gradebook`]:                    '/teacher/student-scores/1',
      [`${c}/settings`]:                     '/teacher/roster/1',
      [`${c}/assignment/edit/reading/11`]:   '/teacher/assignment/edit/assignment/1',
      [`${c}/assignment/edit/homework/11`]:  '/teacher/assignment/edit/assignment/1',
      [`${c}/assignment/edit/external/11`]:  '/teacher/assignment/edit/assignment/1',
      [`${c}/assignment/edit/reading/new`]:  '/teacher/assignment/create/assignment/1',
      [`${c}/assignment/edit/homework/new`]: '/teacher/assignment/create/assignment/1',
      [`${c}/assignment/edit/event/new`]:    '/teacher/assignment/create/assignment/1',
      [`${c}/assignment/edit/external/new`]: '/teacher/assignment/create/assignment/1',
      [`${c}/t/month/2011-11-11/plan/66`]:   '/teacher/metrics/quick/1',
      '/book/1':                             '/reference-view/1',
    };
    for (let route in tests) {
      const translated = tests[route];
      Analytics.onNavigation(route);
      expect(ga).toHaveBeenCalledWith('tutor.set', 'page', translated);
    }
  });
});
