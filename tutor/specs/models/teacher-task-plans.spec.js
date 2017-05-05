import TeacherTaskPlans from '../../src/models/teacher-task-plans';
import { autorun } from 'mobx';
import { map } from 'lodash';

const COURSE_ID = '123';

describe('Teacher Task Plans', function() {
  afterEach(() => TeacherTaskPlans.clear());

  return it('should load tasks and notify', () => {
    const changeSpy = jest.fn();
    autorun(() => {
      changeSpy(map(TeacherTaskPlans.forCourseId(COURSE_ID).array, 'id'));
    });
    expect(changeSpy).toHaveBeenCalledWith([]);
    TeacherTaskPlans.onLoaded({
      data: { plans: [
        { id: '1', hello: 'world', steps: [] },
      ] } }, [ { courseId: COURSE_ID } ]);
    expect(changeSpy).toHaveBeenCalledWith(['1']);
  });
});
