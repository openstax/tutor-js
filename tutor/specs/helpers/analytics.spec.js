import Analytics from '../../src/helpers/analytics';
import Courses from '../../src/models/courses-map';

import COURSE from '../../api/user/courses/1.json';
const COURSE_ID = '1';

describe('Analytics', function() {
  let originalView = Analytics.sendPageView;

  beforeEach(function() {
    this.ga = jest.fn();
    Analytics.setGa(this.ga);
    Courses.bootstrap([ COURSE ]);
    this.sendPageView = Analytics.sendPageView = jest.fn();
  });

  afterEach(() => Analytics.sendPageView = originalView);

  it('sets page view with unknown route events', function() {
    Analytics.onNavigation('/bad/courses/1/list');
    expect(Analytics.sendPageView).toHaveBeenCalledWith('/not-found/bad/courses/1/list');
    return undefined;
  });

  it('skips sending pageviews if ga isn\'t present', function() {
    Analytics.setGa(undefined);
    Analytics.onNavigation('/course/1');
    expect(Analytics.sendPageView).not.toHaveBeenCalled()
    return undefined;
  });

  it('sends the same commands to all trackers', function() {
    // Set up a mock GA function/object
    function Tracker(name) {
      this.name = name;
      this.get = function(fieldName) {
        if ('name' == fieldName) { return this.name; }
      };
    }

    const mockGa = function() {
      if (arguments.length == 0) { return; }
      if (arguments.length == 1 && typeof(arguments[0]) == 'function') {
        return arguments[0]();
      }
      if (arguments[0] == 'create') {
        mockGa.trackers.push(new Tracker(arguments[3]))
      }
    }
    mockGa.trackers = [];
    mockGa.getAll = function() { return this.trackers; }

    // Create two trackers in our mock
    mockGa('create', 42, 42, 't0');
    mockGa('create', 42, 42, 't1');

    Analytics.setGa(mockGa);

    let originalRealGa = Analytics.realGa;
    Analytics.realGa = jest.fn();

    // Fire off a tracking event and then check that it went to both trackers
    Analytics.ga('send', 'blah');

    expect(Analytics.realGa).toHaveBeenCalledWith('t0.send', 'blah');
    expect(Analytics.realGa).toHaveBeenCalledWith('t1.send', 'blah');

    Analytics.realGa = originalRealGa;
    return undefined;
  });

  return it('translates known urls when sending', function() {
    const c = '/course/1';
    const tests = {
      [c]:                             '/student/dashboard/1',
      [`${c}/practice`]:                   '/student/practice/1',
      [`${c}/guide`]:                      '/student/performance-forecast/1',
      [`${c}/t/month/2011-11-11`]:          '/teacher/calendar/1',
      [`${c}/scores`]:                      '/teacher/student-scores/1',
      [`${c}/settings`]:                    '/teacher/roster/1',
      [`${c}/reading/11`]:                  '/teacher/assignment/edit/reading/1',
      [`${c}/homework/11`]:                 '/teacher/assignment/edit/homework/1',
      [`${c}/external/11`]:                 '/teacher/assignment/edit/external/1',
      [`${c}/reading/new`]:                 '/teacher/assignment/create/reading/1',
      [`${c}/homework/new`]:                '/teacher/assignment/create/homework/1',
      [`${c}/external/new`]:                '/teacher/assignment/create/external/1',
      [`${c}/t/month/2011-11-11/plan/66`]:  '/teacher/metrics/quick/1',
      '/books/12':                        '/reference-view/12',
      '/books/12/section/2':              '/reference-view/12/section/2',
      '/books/12/page/22222-333':         '/reference-view/12/page/22222-333',
    };
    for (let route in tests) {
      const translated = tests[route];
      Analytics.onNavigation(route);
      expect(Analytics.sendPageView).toHaveBeenCalledWith(translated);
    }

    return undefined;
  });
});
