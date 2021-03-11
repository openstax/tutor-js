const { Factory, reference } = require('./helpers');
const { range, omit, clone, pick } = require('lodash')

Factory.define('CourseDashboard')
    .all_tasks_are_ready(true)
    .user(reference('User', { profile_id: 1, defaults: ({ is_teacher }) => ({ is_teacher }) }))
    .tasks(({ now, is_teacher }) => {
        if (is_teacher) {
            return []
        }
        return range(1, 25).map(id => omit(Factory.create('StudentDashboardTask', {
            now, days_ago: id-10,
        }), 'course'));
    })
    .plans(({ course, now, is_teacher }) => {
        if (!is_teacher) {
            return []
        }

        let days = -50;

        const defaultPlans = range(1, 25).map(id => omit(Factory.create('TeacherTaskPlan', {
            id, course, now,
            days_ago: (days+=id),
        }), 'course'));

        // Match due_at day offset to render day before + day after current day
        const planSettings = [
            { id: 26, type: 'homework', days_ago: 4 },
            { id: 27, type: 'homework', days_ago: 2 },
            { id: 28, type: 'event',    days_ago: 2 },
            { id: 29, type: 'external', days_ago: 2 },
            { id: 30, type: 'reading',  days_ago: 2 },
        ];

        const setPlans = planSettings.map(s => Factory.create('TeacherTaskPlan', {
            ...s, course, now,
        }));
        return [...defaultPlans, ...setPlans];
    })
    .course(({ course, object: { user } }) => ({
        name: course.name,
        teachers: pick(user, 'id', 'name', 'first_name', 'last_name'),
    }))
    .role(({ course }) => clone(course.roles[0]))
    .research_surveys(({ is_teacher }) => {
        return is_teacher ? null : Factory.create('ResearchSurvey');
    })
