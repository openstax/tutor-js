import { currentCourses }  from '../../../src/models';
import COURSE from '../../../api/user/courses/1.json';
import ROSTER from '../../../api/courses/1/roster.json';
import Roster from '../../../src/screens/course-roster';

export { Roster, currentCourses };

const COURSE_ID = '1';

export function courseRosterBootstrap() {

    currentCourses.bootstrap([COURSE]);
    const { roster } = currentCourses.get(COURSE_ID);
    roster.api.requestCounts.read = 1; // simulate loaded
    roster.update(ROSTER);

    return {
        course: currentCourses.get(COURSE_ID),
        params: { courseId: COURSE_ID },
    };
}
