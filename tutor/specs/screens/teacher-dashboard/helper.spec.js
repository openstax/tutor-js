import UiSettings from 'shared/model/ui-settings';
import Router from '../../../src/helpers/router';
import Helper from '../../../src/screens/teacher-dashboard/helper';

jest.mock('../../../src/helpers/router', () => ({ currentQuery: jest.fn(() => ({})) }));

jest.useFakeTimers();

describe('CourseCalendar Helper', function() {
    const courseId = 99;
    beforeEach(() => UiSettings._reset());

    it('detects if sidebar should show intro', function() {
        expect(Helper.shouldIntro()).toBe(false);
        Router.currentQuery.mockReturnValueOnce({ showIntro: 'true' });
        expect(Helper.shouldIntro()).toBe(true);
    });

    it('stores sidebar state in settings', function() {
        expect(Helper.isSidebarOpen(courseId)).toBe(false);
        Helper.setSidebarOpen(courseId, true);
        expect(Helper.isSidebarOpen(courseId)).toBe(true);
    });

    xit('will schedule intro callbacks', function() {
        Router.currentQuery.mockReturnValueOnce({ showIntro: 'true' });
        const cbSpy = jest.fn();
        Helper.scheduleIntroEvent(cbSpy, 1, 2, 3);
        expect(cbSpy).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(cbSpy).toHaveBeenCalled(1, 2, 3);
    });
});
