import Courses from '../../../src/models/courses-map';
import COURSE from '../../../api/user/courses/1.json';
import ROSTER from '../../../api/courses/1/roster.json';
import Roster from '../../../src/screens/course-roster';

export { Roster, Courses };

const COURSE_ID = '1';

export function courseRosterBootstrap() {

    Courses.bootstrap([COURSE]);
    const { roster } = Courses.get(COURSE_ID);
    roster.api.requestCounts.read = 1; // simulate loaded
    roster.update(ROSTER);

    return {
        course: Courses.get(COURSE_ID),
        params: { courseId: COURSE_ID },
    };
}
