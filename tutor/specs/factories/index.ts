import FactoryBot from 'object-factory-bot';
import { range } from 'lodash';
import { hydrateModel } from 'shared/model'
import '../../../shared/specs/factories';
import faker from 'faker';
import {
    CoursesMap, Course, CoursePeriod, Exercise, ReferenceBook, TaskPlanStats, Note, TeacherTaskPlan,
    ReferenceBookNode,
    OfferingsMap, Offering,
    EcosystemsMap,
    Ecosystem,
    ExercisesMap,
    ResearchSurvey,
    StudentDashboardTask,
    GradingTemplate,
}  from '../../src/models'

//import  from '../../src/models/task-plans/teacher/stats';
// import {  } from '../../src/models/course/offerings';
// import {  } from '../../src/models/ecosystems';
// import {  } from '../../src/models/exercises';
// import  from '../../src/models/research-surveys/survey';
// import  from '../../src/models/task-plans/student/task';

// import {  } from '../../src/models/grading/templates';

import './definitions';
import { studentTasks, studentTask } from './student-task-models';
import type { GradingTemplateData, CourseData, TutorExerciseData, TeacherTaskPlanData, PeriodPerformanceData, StudentTaskData }from '../../src/models/types'

export interface Model extends Function {
    new(..._args: any[]): any;
}

function factoryFactory<T extends Model>(factoryName: string, Model: T) {
    return (attrs = {}, parent?: any): InstanceType<T> => {
        const data = FactoryBot.create(factoryName as string, attrs);
        return hydrateModel(Model, data, parent)
    };
}


const Factories = {
    studentTask,
    studentTasks,
    bot: FactoryBot,
    data: (name: string, data?: any) => FactoryBot.create(name, data),
    setSeed(seed: number) {
        return faker.seed(seed);
    },

    note: factoryFactory('Note', Note),
    book: factoryFactory('Book', ReferenceBook),
    page: factoryFactory('Page', ReferenceBookNode),
    course: factoryFactory('Course', Course),
    period: factoryFactory('Period', CoursePeriod),
    offering: factoryFactory('Offering', Offering),
    ecosystem: factoryFactory('Ecosystem', Ecosystem),
    taskPlanStats: factoryFactory('TaskPlanStats', TaskPlanStats),
    tutorExercise: factoryFactory('TutorExercise', Exercise),
    researchSurvey: factoryFactory('ResearchSurvey', ResearchSurvey),
    teacherTaskPlan: factoryFactory('TeacherTaskPlan', TeacherTaskPlan),
    gradingTemplate: factoryFactory('GradingTemplate', GradingTemplate),
    studentDashboardTask: factoryFactory('StudentDashboardTask', StudentDashboardTask),

    coursesMap: ({ count = 2, ...attrs }:any = {}) => {
        const map = new CoursesMap();
        map.onLoaded(range(count).map(() => FactoryBot.create('Course', attrs) as CourseData));
        return map;
    },

    ecosystemsMap: ({ count = 4 } = {}) => {
        const map = new EcosystemsMap();
        map.mergeModelData( range(count).map(() => FactoryBot.create('Ecosystem')) )
        return map;
    },

    pastTaskPlans: ({ course, count = 4, ...rest }: { course: Course, count?: number } & Record<string, any>) => {
        course.pastTaskPlans.onLoaded(
            range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course, ...rest })) as TeacherTaskPlanData[],
        );
        return course.pastTaskPlans;
    },

    teacherTaskPlans: ({ course, count = 4 }: { course: Course, count?: number}) => {
        course.teacherTaskPlans.onLoaded(
            range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course })) as any,
        );
        return course.teacherTaskPlans;
    },

    studentTaskPlans: ({ course, count = 4, attributes = {} }: { course: Course, count?: number, attributes?: any}) => {
        course.studentTaskPlans.onLoaded({
            research_surveys: null,
            all_tasks_are_ready: true,
            tasks: range(count).map(() => FactoryBot.create(
                'StudentDashboardTask', Object.assign({ course }, attributes)
            )) as StudentTaskData[],
        });
    },


    courseRoster: ({ course }: { course: Course }) => {
        course.roster.update( FactoryBot.create('CourseRoster', { course }) );
    },

    scores: ({ course }: { course: Course }) => {
        course.scores.onFetchComplete(
            course.periods.map(period => FactoryBot.create('ScoresForPeriod', { period }) as PeriodPerformanceData),
        );
        return course.scores;
    },

    notesPageMap: ({ course, page, count = 4 }: { course: Course, page: ReferenceBookNode, count?: number }) => {
        const notes = course.notes.ensurePageExists(page);
        range(count).forEach(() => {
            const note = hydrateModel(Note, FactoryBot.create('Note', { page }), page)
            notes.set(note.id, note);
        })
        return notes;
    },

    exercisesMap: ({ now, book, pageIds = [], count = 4 }: { now?: Date, book?: ReferenceBook, pageIds?: number[], count?: number} = {}) => {
        const map = new ExercisesMap();
        if (!book) { return map; }
        if (book.children.length == 0) {
            book.update( FactoryBot.create('Book') );
        }
        if (pageIds.length == 0) {
            pageIds = book.children[1].children.map((pg: ReferenceBookNode) => pg.id);
        }
        pageIds.forEach(pgId => {
            map.onLoaded(
                range(count).map(() => FactoryBot.create('TutorExercise', {
                    now, page_uuid: book.pages.byId.get(pgId).uuid,
                })) as TutorExerciseData[],
                undefined, book, [ pgId ],
            );
        });
        return map;
    },

    offeringsMap: ({ count = 4 }: { count?: number } = {}): OfferingsMap => {
        const map = new OfferingsMap();
        range(count).map(() => {
            const o = hydrateModel(Offering, FactoryBot.create('Offering', {}))
            map.set(o.id, o)
        })
        return map;
    },


    gradingTemplates: ({ course, count = 2 }: { course: Course, count?: number }) => {
        const map = course.gradingTemplates;
        map.onLoaded(
            range(count).map(() => FactoryBot.create('GradingTemplate', { course }) as GradingTemplateData),
        );
        return map;
    },

}

// const n = Factories.note()

export { FactoryBot, faker };
export default Factories;
