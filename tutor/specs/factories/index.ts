import FactoryBot from 'object-factory-bot';
import { range } from 'lodash';
import { hydrateModel } from 'shared/model'
import '../../../shared/specs/factories';
import faker from 'faker';
import Course from '../../src/models/course';
import TutorExercise from '../../src/models/exercises/exercise';
import Book from '../../src/models/reference-book';
import TaskPlanStat from '../../src/models/task-plans/teacher/stats';
import { OfferingsMap, Offering } from '../../src/models/course/offerings';
import { CoursesMap } from '../../src/models/courses-map';
import { EcosystemsMap, Ecosystem } from '../../src/models/ecosystems';
import { ExercisesMap } from '../../src/models/exercises';
import ResearchSurvey from '../../src/models/research-surveys/survey';
import StudentDashboardTask from '../../src/models/task-plans/student/task';
import Note from '../../src/models/notes/note';
import Stat from '../../src/models/stats';
import { GradingTemplate } from '../../src/models/grading/templates';
import Page from '../../src/models/reference-book/node';
import TeacherTaskPlan from '../../src/models/task-plans/teacher/plan';
import './definitions';
import { studentTasks, studentTask } from './student-task-models';
import { GradingTemplateObj, CourseObj, TutorExerciseObj }from '../../src/models/types'

export interface Model extends Function {
    new(...args: any[]): any;
}

function factoryFactory<T extends Model>(factoryName: string, Model: T) {
    return (attrs = {}, parent?: any): InstanceType<T> => {
        const data = FactoryBot.create(factoryName as string, attrs);
        return hydrateModel(Model, data,  parent)
    };
}


const Factories = {
    studentTask,
    studentTasks,
    bot: FactoryBot,
    setSeed(seed: number) {
        return faker.seed(seed);
    },

    note: factoryFactory('Note', Note),
    stat: factoryFactory('Stat', Stat),
    book: factoryFactory('Book', Book),
    page: factoryFactory('Page', Page),
    course: factoryFactory('Course', Course),
    offering: factoryFactory('Offering', Offering),
    ecosystem: factoryFactory('Ecosystem', Ecosystem),
    taskPlanStat: factoryFactory('TaskPlanStat', TaskPlanStat),
    tutorExercise: factoryFactory('TutorExercise', TutorExercise),
    researchSurvey: factoryFactory('ResearchSurvey', ResearchSurvey),
    teacherTaskPlan: factoryFactory('TeacherTaskPlan', TeacherTaskPlan),
    gradingTemplate: factoryFactory('GradingTemplate', GradingTemplate),
    studentDashboardTask: factoryFactory('StudentDashboardTask', StudentDashboardTask),

    coursesMap: ({ count = 2, ...attrs } = {}) => {
        const map = new CoursesMap();
        map.onLoaded(range(count).map(() => FactoryBot.create('Course', attrs) as CourseObj));
        return map;
    },

    ecosystemsMap: ({ count = 4 } = {}) => {
        const map = new EcosystemsMap();
        map.mergeModelData( range(count).map(() => FactoryBot.create('Ecosystem')) )
        return map;
    },

    pastTaskPlans: ({ course, count = 4 }: { course: Course, count: number}) => {
        course.pastTaskPlans.onLoaded({
            data: {
                items: range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course })),
            },
        });
        return course.pastTaskPlans;
    },

    teacherTaskPlans: ({ course, count = 4 }: { course: Course, count: number}) => {
        course.teacherTaskPlans.onLoaded({
            data: {
                plans: range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course })),
            },
        });
        return course.teacherTaskPlans;
    },

    studentTaskPlans: ({ course, count = 4, attributes = {} }: { course: Course, count: number, attributes: any}) => {
        course.studentTaskPlans.onLoaded({ data: {
            tasks: range(count).map(() => FactoryBot.create(
                'StudentDashboardTask', Object.assign({ course }, attributes)
            )),
        }});
    },


    courseRoster: ({ course }: { course: Course }) => {
        course.roster.onApiRequestComplete({
            data: FactoryBot.create('CourseRoster', { course }),
        });
    },

    scores: ({ course }: { course: Course }) => {
        course.scores.onFetchComplete({
            data: course.periods.map(period => FactoryBot.create('ScoresForPeriod', { period })),
        });
        return course.scores;
    },

    notesPageMap: ({ course, page, count = 4 }: { course: Course, page: Page, count: number }) => {
        const notes = course.notes.ensurePageExists(page);
        range(count).forEach(() => {
            const note = hydrateModel(Note, FactoryBot.create('Note', { page }), page)
            notes.set(note.id, note);
        })
        return notes;
    },

    exercisesMap: ({ now, book, pageIds = [], count = 4 }: { now?: Date, book?: Book, pageIds?: number[], count?: number} = {}) => {
        const map = new ExercisesMap();
        if (!book) { return map; }
        if (book.children.length == 0) {
            book.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
        }
        if (pageIds.length == 0) {
            pageIds = book.children[1].children.map((pg: Page) => pg.id);
        }
        pageIds.forEach(pgId => {
            map.onLoaded(
                range(count).map(() => FactoryBot.create('TutorExercise', {
                    now, page_uuid: book.pages.byId.get(pgId).uuid,
                })) as TutorExerciseObj[],
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


    gradingTemplates: ({ course, count = 2 }: { course: Course, count: number }) => {
        const map = course.gradingTemplates;
        map.onLoaded(
            range(count).map(() => FactoryBot.create('GradingTemplate', { course }) as GradingTemplateObj),
        );
        return map;
    },

}

// const n = Factories.note()

export { FactoryBot, faker };
export default Factories;
