import { Factory, TimeMock } from '../../helpers';
// import COURSE_1_DATA from '../../../api/courses/1/dashboard.json';
// import COURSE_2_DATA from '../../../api/courses/2/dashboard.json';
import { keys } from 'lodash';
import Time from 'shared/model/time'
import { Course, StudentTaskPlans } from '../../../src/models'

jest.useFakeTimers();

describe('Student Tasks Model', () => {
    let course: Course;
    let tasks!:StudentTaskPlans

    const now = TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        course = Factory.course();
        Factory.studentTaskPlans({ course, count: 8 });
        tasks = course.studentTaskPlans;
    });

    afterEach(() => {
        tasks.clear();
    });

    it('splits into weeks', () => {
        let week = 1;
        const start = new Time('2015-11-01');
        tasks.array.forEach(t => t.due_at = start.plus({ week: week += 1 }));
        expect(keys(tasks.byWeek)).toEqual([
            '201546', '201547', '201548', '201549', '201550', '201551', '201552', '201553',
        ]);
    });

    it('#thisWeeksTasks', () => {
        expect(tasks.thisWeeksTasks.length).toEqual(tasks.array.length);
        tasks.array.forEach(t => t.due_at = tasks.startOfThisWeek.minus({ day: 1 }))
        expect(tasks.thisWeeksTasks.length).toEqual(0);
    });

    it('#upcomingTasks', () => {
        const task = tasks.array[0];
        task.due_at = now.startOf('week').plus({ week: 1 }).endOf('day')
        expect(tasks.upcomingTasks).toContain(task);
    });

    it('#all_tasks_are_ready', () => {
        tasks.all_tasks_are_ready = true;
        tasks.onLoaded({ tasks: [], all_tasks_are_ready: false });
        expect(tasks.all_tasks_are_ready).toEqual(false);
    });

    it('polls when opened', () => {
        tasks.fetch = jest.fn(() => ( { then: (fn: any) => fn() } )) as any;
        expect(tasks.refreshTimer).toBeNull()
        tasks.startFetching();
        expect(tasks.fetch).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers();
        expect(tasks.fetch).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenCalledWith(tasks.fetchTaskPeriodically, 1000 * 60 * 60);
        jest.runOnlyPendingTimers();
        expect(tasks.fetch).toHaveBeenCalledTimes(3);
        tasks.stopFetching();
        expect(clearInterval).toHaveBeenCalled();
        expect(tasks.refreshTimer).toBeNull();
    });

    it('polls quickly if tasks are not ready', () => {
        tasks.fetch = jest.fn(() => ( { then: (fn: any) => fn() } )) as any;
        course.primaryRole.joined_at = now
        tasks.all_tasks_are_ready = false;
        tasks.startFetching();
        expect(tasks.isPendingTaskLoading).toEqual(true);
        expect(setTimeout).toHaveBeenCalledWith(tasks.fetchTaskPeriodically, 10000);
    });

    // it('tests if the last published plan is present', () => {
    //     course.teacherTaskPlans.reset();
    //     expect(tasks.isLatestPresent).toBe(true);
    //     course.teacherTaskPlans.set(1, { id: '1', last_published_at: new Time('2017-01-02T00:00:00.000Z') });
    //     course.teacherTaskPlans.set(1, { id: '2', last_published_at: new Time('2017-01-03T00:00:00.000Z') });
    //     expect(tasks.isLatestPresent).toBe(false);
    //     tasks.set(1, { task_plan_id: 1 })
    //     expect(tasks.isLatestPresent).toBe(false);
    //     tasks.set(1, { task_plan_id: 2 });
    //     expect(tasks.isLatestPresent).toBe(true);
    // });
});
