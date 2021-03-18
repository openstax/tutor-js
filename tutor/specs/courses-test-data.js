import CoursesMap from '../src/models/courses-map';
import moment from 'moment';
import { runInAction } from 'mobx';

const STUDENT_COURSE_ONE_MODEL = {
    id: '1',
    name: 'Local Test Course One',
    book_id: '123',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: true,
    is_concept_coach: false,
    is_college: true,
    does_cost: true,
    year: 2017,
    term: 'spring',
    ecosystem_book_uuid: '3402dc53-113d-45f3-954e-8d2ad1e73659',
    ecosystem_id: '11',
    starts_at: moment().subtract(1, 'month').format(),
    ends_at: moment().add(1, 'month').format(),
    webview_url: 'http://cnx.org/',
    salesforce_book_name: 'a book title',
    current_role_id: '1',
    roles: [{
        id: '1',
        type: 'student',
        joined_at: moment().subtract(1, 'week').format(),
    }],

    students: [{
        role_id: '1', student_identifier: '1234', uuid: '06fc16fc-70f5-4db1-a61d-b0f496cf3cd4',
        is_paid: false, is_comped: false, is_active: true, first_name: 'Test', last_name: 'Tester',
    }],
};

const TEACHER_COURSE_TWO_MODEL = {
    id: '2',
    homework_score_weight: 0.80,
    homework_progress_weight: 0.15,
    reading_score_weight: 0.05,
    reading_progress_weight: 0.0,
    name: 'Local Test Course Two',
    book_id: '123',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: true,
    is_concept_coach: false,
    year: 2017,
    term: 'spring',
    ecosystem_book_uuid: '3402dc53-113d-45f3-954e-8d2ad1e73659',
    ecosystem_id: '12',
    starts_at: moment().subtract(1, 'month').format(),
    ends_at: moment().add(1, 'month').format(),
    webview_url: 'http://cnx.org/',
    salesforce_book_name: 'a book title',
    current_role_id: '1',
    periods: [{
        id: '1',
        name: '1st',
        num_enrolled_students: 12,
        enrollment_url: 'http://test/period/1',
        default_open_time: '07:01',
        default_due_time: '12:00',
        is_archived: false,
    }],

    roles: [{
        id: '1',
        type: 'teacher',
        joined_at: moment().subtract(2, 'week').format(),
    }],
};

const TEACHER_AND_STUDENT_COURSE_THREE_MODEL = {
    id: '3',
    book_id: '123',
    name: 'Local Test Course Three',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: true,
    is_concept_coach: false,
    year: 2017,
    term: 'spring',
    ecosystem_book_uuid: '3402dc53-113d-45f3-954e-8d2ad1e73659',
    ecosystem_id: '13',
    starts_at: moment().subtract(1, 'month').format(),
    ends_at: moment().add(1, 'month').format(),
    current_role_id: '2',
    roles: [{
        id: '1',
        type: 'student',
        joined_at: moment().subtract(1, 'week').format(),
    }, {
        id: '2',
        type: 'teacher',
        joined_at: moment().subtract(1, 'week').format(),
    }],

    students: [{
        role_id: '1', student_identifier: '1234', uuid: '06fc16fc-70f5-4db1-a61d-b0f496cf3cd4',
        is_paid: false, is_comped: false, is_active: true, first_name: 'Test', last_name: 'Tester',
    }],
};

const STUDENT_ARCHIVED_COURSE = {
    id: '4',
    book_id: '123',
    name: 'Local Test Course Three',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: false,
    is_concept_coach: false,
    year: 2016,
    term: 'spring',
    starts_at: moment().subtract(1, 'month').format(),
    ends_at: moment().add(1, 'month').format(),
    webview_url: 'http://cnx.org/',
    salesforce_book_name: 'a book title',
    current_role_id: '1',
    roles: [{
        id: '1',
        type: 'student',
        joined_at: moment().subtract(1, 'week').format(),
    }],
};

const TEACHER_PAST_COURSE = {
    id: '5',
    book_id: '123',
    name: 'Local Test Course Three',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: false,
    is_concept_coach: false,
    year: 2016,
    term: 'spring',
    starts_at: moment().subtract(6, 'month').format(),
    ends_at: moment().subtract(1, 'month').format(),
    webview_url: 'http://cnx.org/',
    salesforce_book_name: 'a book title',
    current_role_id: '1',
    roles: [{
        id: '1',
        type: 'teacher',
        joined_at: moment().subtract(1, 'week').format(),
    }],
};

const STUDENT_PAST_COURSE = {
    id: '6',
    book_id: '123',
    name: 'Local Test Course Three',
    appearance_code: 'testing',
    offering_id: '1',
    is_active: false,
    is_concept_coach: false,
    year: 2016,
    term: 'spring',
    starts_at: moment().subtract(6, 'month').format(),
    ends_at: moment().subtract(1, 'month').format(),
    webview_url: 'http://cnx.org/',
    salesforce_book_name: 'a book title',
    current_role_id: '1',
    roles: [{
        id: '1',
        type: 'student',
        joined_at: moment().subtract(1, 'week').format(),
    }],
};

const MASTER_COURSES_LIST = [
    STUDENT_COURSE_ONE_MODEL,
    TEACHER_COURSE_TWO_MODEL,
    TEACHER_AND_STUDENT_COURSE_THREE_MODEL,
];

const TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor';
const CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach';

const bootstrapCoursesList = () => runInAction(() => CoursesMap.bootstrap(MASTER_COURSES_LIST));

export { STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, STUDENT_ARCHIVED_COURSE, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST, TUTOR_HELP, CONCEPT_COACH_HELP, TEACHER_PAST_COURSE, STUDENT_PAST_COURSE, bootstrapCoursesList };
