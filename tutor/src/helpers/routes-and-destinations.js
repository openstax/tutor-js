import Router from '../helpers/router';
import { find, isNil } from 'lodash';

const COURSE_SETTINGS = 'Course Settings';
const COURSE_ROSTER = 'Course Roster';
const DASHBOARD = 'Dashboard';
const QUESTION_LIBRARY = 'Question Library';
const EXTERNAL_BUILDER = 'External Assignment';
const HOMEWORK_BUILDER = 'Homework Builder';
const PERFORMANCE_FORECAST = 'Performance Forecast';
const SCORES = 'Scores';
const PLAN_REVIEW = 'Plan Review';
const PLAN_STATS = 'Plan Stats';
const READING_BUILDER = 'Reading Builder';

const REMEMBERED_ROUTES = {
    dashboard: {
        label: DASHBOARD,
    },

    viewStudentDashboard: {
        label: DASHBOARD,
    },

    viewPerformanceGuide: {
        label: PERFORMANCE_FORECAST,

        condition(match) {
            return isNil(match.params.roleId);
        },
    },

    viewTeacherDashboard: {
        label: DASHBOARD,
    },

    viewGradebook: {
        label: SCORES,
    },

    viewQuestionsLibrary: {
        label: QUESTION_LIBRARY,
    },

    taskplans: {
        label: DASHBOARD,
    },

    calendarByDate: {
        label: DASHBOARD,
    },

    calendarViewPlanStats: {
        label: DASHBOARD,
    },

    courseRoster: {
        label: COURSE_ROSTER,
    },

    courseSettings: {
        label: COURSE_SETTINGS,
    },

    viewStats: {
        label: PLAN_STATS,
    },

    reviewTask: {
        label: PLAN_REVIEW,
    },

    reviewTaskPeriod: {
        label: PLAN_REVIEW,
    },

    reviewTaskStep: {
        label: PLAN_REVIEW,
    },
};

const destinationHelpers = {
    getDestinationName(routeName) {
        return REMEMBERED_ROUTES[routeName].label;
    },

    routeFromPath(path) {
        const match = Router.currentMatch(path);
        return find(match != null ? match.entry.paths : [], pathName => REMEMBERED_ROUTES[pathName].label);
    },

    destinationFromPath(path) {
        const route = Router.currentMatch(path);
        return this.getDestinationName(route.entry.name);
    },

    shouldRememberRoute(path) {
        const match = Router.currentMatch(path);

        return (
            !!REMEMBERED_ROUTES[match != null ? match.entry.name : undefined]
        ) && (
            (
                (REMEMBERED_ROUTES[match != null ? match.entry.name : undefined].condition != null) &&
        REMEMBERED_ROUTES[match != null ? match.entry.name : undefined].condition(match)
            ) ||
        (REMEMBERED_ROUTES[match != null ? match.entry.name : undefined].condition == null)
        );
    },
};


export default destinationHelpers;
