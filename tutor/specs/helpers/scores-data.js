import { bootstrapCoursesList } from '../courses-test-data';
import DATA from '../../api/courses/1/performance.json';

const COURSE_ID = 2;

export default function bootstrapScoresReport() {
    const course = bootstrapCoursesList().get(COURSE_ID);
    course.scores.periods.clear();
    const scores = course.scores;
    scores.onFetchComplete({ data: DATA });
    scores.api.requestCounts.read = 1;
    const period = course.scores.periods.get('1');
    return { course, scores, period };
}
