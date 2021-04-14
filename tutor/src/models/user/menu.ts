import { pickBy, extend, pick, each, isFunction, get } from 'lodash';
import { observable } from 'mobx';
import { CurrentCourses as Courses, Course, CurrentUser as User } from '../../models'
//import User from '../user';
//import , { Course } from '../courses-map';
// import  from '../payments';
import { ID } from '../../store/types';

import { TUTOR_HELP, SUPPORT_EMAIL } from '../../config'


const ROUTES = {

    myCourses: {
        label: 'My Courses',
        locked(course: Course) { return get(course, 'currentRole.isTeacherStudent'); },
        params: () => undefined,
        options: {
            separator: 'after',
        },
    },
    dashboard: {
        label: 'Dashboard',
        icon: 'home',
        isAllowed(course: Course) { return !!course; },
    },
    browseBook: {
        label: 'Browse the Book',
        isAllowed(course: Course) { return !!course; },
    },
    studentScores: {
        label: 'Scores',
        roles: {
            student: 'viewGradebook',
        },
    },
    practiceQuestions: {
        label: 'My Practice Questions',
        roles: {
            student: 'practiceQuestions',
        },
    },
    guide: {
        label: 'Performance Forecast',
        isAllowed(course: Course) { return get(course, 'is_concept_coach') !== true; },
        roles: {
            student: 'viewPerformanceGuide',
            teacher: 'viewPerformanceGuide',
        },
    },
    questions: {
        label: 'Question Library',
        roles: {
            teacher: 'viewQuestionsLibrary',
        },
    },
    scores: {
        label: 'Gradebook',
        roles: {
            teacher: 'viewGradebook',
        },
    },
    courseSettings: {
        label: 'Course Settings',
        roles: {
            teacher: 'courseSettings',
        },
    },
    courseRoster: {
        label: 'Course Roster',
        roles: {
            teacher: 'courseRoster',
        },
    },
    get_started: {
        label: 'Getting Started',
        isAllowed(course: Course) { return get(course, 'is_concept_coach') === true; },
        roles: {
            teacher: 'ccDashboardHelp',
        },
    },
    changeId: {
        label: 'Change Student ID',
        locked(course: Course) { return get(course, 'currentRole.isTeacherStudent'); },
        roles: {
            student: 'changeStudentId',
        },
        options: {
            separator: 'after',
        },
    },
    cloneCourse: {
        label: 'Copy this Course',
        params({ courseId }: { courseId: ID }) {
            return { sourceId: courseId };
        },
        roles: {
            teacher: 'createNewCourse',
        },
        isAllowed(course: Course) {
            return !!(course && !course.is_preview && User.canCreateCourses);
        },
        options: {
            key: 'cloneCourse',
        },
    },
    createNewCourse: {
        label: 'Create a Course',
        isAllowed() { return User.canCreateCourses; },
        options({ course }: { course: Course }) {
            return course ? { separator: 'before' } : { separator: 'both' };
        },
    },
    customer_service: {
        label: 'Customer Service',
        href: '/customer_service',
        options: { redirect: true },
        isAllowed() { return !!User.is_customer_service; },
    },
    stats: {
        label: 'Usage Stats',
        href: '/stats',
        options: { redirect: true },
        isAllowed() { return !!User.is_admin; },
    },
    admin: {
        label: 'Admin',
        href: '/admin',
        options: { redirect: true },
        isAllowed() { return !!User.is_admin; },
    },
    QADashboard: {
        label: 'QA Dashboard',
        options: { redirect: true },
        isAllowed() { return !!User.is_content_analyst; },
    },
    managePayments: {
        label: 'Manage Payments',
        locked(course: Course) { return get(course, 'currentRole.isTeacherStudent'); },
        isAllowed(course: Course) { return Boolean(
            this.locked(course) || Courses.costing.student.any
        ); },
    },
    qaHome: {
        label: 'Content Analyst',
        href: '/content_analyst',
        options: { redirect: true },
        isAllowed() { return !!User.is_content_analyst; },
    },

};


function getRouteByRole(routeName: string, menuRole: string) {
    if (!ROUTES[routeName].roles) { return routeName; }
    return ROUTES[routeName].roles[menuRole];
}

function addRouteProperty(route: any, property: string, rules: any, options: any, defaults?: any) {
    let value;
    if (isFunction(rules[property])) {
        value = rules[property](options);
    } else {
        value = rules[property] || defaults;
    }
    if (value) {
        route[property] = value;
    }
}


export const UserMenu = observable({

    get helpURL() {
        return TUTOR_HELP;
    },

    get supportEmail() {
        return SUPPORT_EMAIL;
    },

    helpLinkForCourse(course: Course) {
        if (!course) { return this.helpURL; }
        return TUTOR_HELP;
    },

    getRoutes(course: Course) {
        let isTeacher = false
        let menuRole = ''
        let courseId: ID = ''

        if (course) {
            courseId = course.id;
            menuRole = course.currentRole.isTeacher ? 'teacher' : 'student';
        }
        const options = { courseId: courseId, menuRole };
        const validRoutes = pickBy(
            ROUTES, (route: any, routeName: string) =>
                (!route.isAllowed || route.isAllowed(course)) &&
        (!route.isTeacher || isTeacher) &&
        getRouteByRole(routeName, menuRole)
        );
        const routes: any[] = [];

        each(validRoutes, (routeRules, routeName) => {
            const name = getRouteByRole(routeName, menuRole);
            const route = { name };
            extend(route, pick(routeRules, 'href', 'target'));
            addRouteProperty(route, 'locked', routeRules, course);
            addRouteProperty(route, 'options', routeRules, options, {});
            addRouteProperty(route, 'params', routeRules, options, course ? { courseId } : null);
            addRouteProperty(route, 'label', routeRules, options);
            addRouteProperty(route, 'icon', routeRules, options);
            routes.push(route);
        });
        return routes;
    },

});
