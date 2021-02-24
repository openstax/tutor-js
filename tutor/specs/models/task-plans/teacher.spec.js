import Courses from '../../../src/models/courses-map';
import { autorun } from 'mobx';
import { map } from 'lodash';

const COURSE_ID = '123';

describe('Teacher Task Plans', function() {
    let course;

    beforeEach(() => {
        Courses.bootstrap([{ id: COURSE_ID }], { clear: true });
        course = Courses.get(COURSE_ID);
    });
    afterEach(() => {
        Courses.clear();
        course.teacherTaskPlans.clear();
    });

    it('has api', () => {
        expect(course.teacherTaskPlans.api).not.toBeUndefined();
    });

    it('should load tasks and notify', () => {
        const changeSpy = jest.fn();
        autorun(() => {
            changeSpy(map(course.teacherTaskPlans.array, 'id'));
        });
        expect(changeSpy).toHaveBeenCalledWith([]);
        course.teacherTaskPlans.onLoaded({
            data: {
                plans: [
                    { id: '1', hello: 'world', steps: [] },
                ],
            },
        }, [ { courseId: COURSE_ID } ]);
        expect(changeSpy).toHaveBeenCalledWith(['1']);
    });

    it('filters out deleting plans', () => {
        course.teacherTaskPlans.onLoaded({
            data: {
                plans: [
                    { id: '1', hello: 'world', steps: [] },
                    { id: '2', hello: 'world', steps: [] },
                ],
            },
        }, [ { courseId: COURSE_ID } ]);

        course.teacherTaskPlans.get(1).is_deleting = true;
        expect(course.teacherTaskPlans.active.array).toHaveLength(1);
    });

    it('can store a cloned plan', () => {
        const plan = {
            'title': 'Homework','ecosystem_id': '7',
            'id': '_CREATING_0',
            'type': 'homework','is_feedback_immediate': true,
            'settings': {
                'page_ids': [
                    '1081','1090','1108','1131','1092','1071','1089','1143','1098','1148',
                ],
                'exercises': [
                    { id: '23771', points: [1] }, { id: '23446', points: [1] }, { id: '23740', points: [1] },
                    { id: '23450', points: [1] }, { id: '23750', points: [1] }, { id: '23769', points: [1] },
                    { id: '23757', points: [1] }, { id: '24508', points: [1] }, { id: '23763', points: [1] },
                    { id: '24499', points: [1] },
                ],
                'exercises_count_dynamic': 4,
            },
            'cloned_from_id': '215',
            'tasking_plans': [{
                'opens_at': '2017-01-01T00:00:00.000Z',
                'target_id': '61',
                'target_type': 'period',
                'due_at': '2017-06-20',
            }, {
                'opens_at': '2017-01-01T00:00:00.000Z',
                'target_id': '62',
                'target_type': 'period',
                'due_at': '2017-06-20',
            }],
        };
        const plans = course.teacherTaskPlans;
        plans.addClone(plan);
        const model = plans.get(plan.id);
        expect(model.tasking_plans).toHaveLength(2);
        expect(model.id).toEqual(plan.id);
        model.tasking_plans.forEach((tp, i) => {
            expect(tp.opens_at).toEqual(plan.tasking_plans[i].opens_at);
            expect(tp.due_at).toEqual(plan.tasking_plans[i].due_at);
        });
    });

    it('lastPublished', () => {
        course.teacherTaskPlans.onLoaded({
            data: {
                plans: [
                    { id: '1', last_published_at: '2017-01-02T00:00:00.000Z' },
                    { id: '2', last_published_at: '2017-01-01T00:00:00.000Z' },
                    { id: '3', last_published_at: '2017-01-04T00:00:00.000Z' },
                    { id: '4', last_published_at: '2016-01-01T00:00:00.000Z' },
                ],
            },
        }, [ { courseId: COURSE_ID } ]);
        expect(course.teacherTaskPlans.lastPublished.id).toEqual('3');
    });
});
