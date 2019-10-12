import FactoryBot from 'object-factory-bot';
import { each, camelCase, range } from 'lodash';
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
import { ResearchSurvey } from '../../src/models/research-surveys/survey';
import StudentDashboardTask from '../../src/models/task-plans/student/task';
import Note from '../../src/models/notes/note';
import Page from '../../src/models/reference-book/page';
import TeacherTaskPlan from '../../src/models/task-plans/teacher/plan';

import './research_survey';
import './teacher-task-plan';
import './student-task';
import './course';
import './book';
import './task-plan-stats';
import './ecosystem';
import './exercise';
import './scores';
import './offering';
import './course-roster';
import { studentTasks, studentTask } from './student-tasks';
import './note';

const Factories = {
  studentTask,
  studentTasks,
  bot: FactoryBot,
  setSeed(seed) {
    return faker.seed(seed);
  },
};

each({
  Note,
  Book,
  Page,
  Course,
  Offering,
  Ecosystem,
  TaskPlanStat,
  TutorExercise,
  ResearchSurvey,
  TeacherTaskPlan,
  StudentDashboardTask,
}, (Model, name) => {
  Factories[camelCase(name)] = (attrs = {}, modelArgs) => {
    const o = FactoryBot.create(name, attrs);
    return new Model(o, modelArgs);
  };
});


Factories.coursesMap = ({ count = 2, ...attrs } = {}) => {
  const map = new CoursesMap();
  map.onLoaded({ data: range(count).map(() => FactoryBot.create('Course', attrs)) });
  return map;
};

Factories.ecosystemsMap = ({ count = 4 } = {}) => {
  const map = new EcosystemsMap();
  map.onLoaded({ data: range(count).map(() => FactoryBot.create('Ecosystem')) });
  return map;
};

Factories.pastTaskPlans = ({ course, count = 4 }) => {
  course.pastTaskPlans.onLoaded({
    data: {
      items: range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course })),
    },
  });
  return course.pastTaskPlans;
};

Factories.teacherTaskPlans = ({ course, count = 4 }) => {
  course.teacherTaskPlans.onLoaded({
    data: {
      plans: range(count).map(() => FactoryBot.create('TeacherTaskPlan', { course })),
    },
  });
  return course.teacherTaskPlans;
};

Factories.studentTaskPlans = ({ course, count = 4, attributes = {} }) => {
  course.studentTaskPlans.onLoaded({
    data: {
      tasks: range(count).map(() => FactoryBot.create('StudentDashboardTask',
        Object.assign({ course }, attributes)
      )),
    },
  });
};


Factories.courseRoster = ({ course }) => {
  course.roster.onApiRequestComplete({
    data: FactoryBot.create('CourseRoster', { course }),
  });
};

Factories.scores = ({ course }) => {
  course.scores.onFetchComplete({
    data: course.periods.map(period => FactoryBot.create('ScoresForPeriod', { period })),
  });
  return course.scores;
};

Factories.notesPageMap = ({ course, page, count = 4 }) => {
  const notes = course.notes.forPage(page);
  range(count).forEach(() => {
    const note = new Note(FactoryBot.create('Note', { page }), page)
    notes.set(note.id, note);
  })
  return notes;
}

Factories.exercisesMap = ({ now, book, pageIds = [], count = 4 } = {}) => {
  const map = new ExercisesMap();
  if (!book) { return map; }
  if (book.children.length == 0) {
    book.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
  }
  if (pageIds.length == 0) {
    pageIds = book.children[1].children.map(pg => pg.id);
  }
  pageIds.forEach(pgId => {
    map.onLoaded({
      data: {
        items: range(count).map(() => FactoryBot.create('TutorExercise', {
          now,

          page_uuid: book.pages.byId.get(pgId).uuid,
        })),
      },
    }, [{ book, page_ids: [ pgId ] }]);
  });
  return map;
};

Factories.offeringsMap = ({ count = 4 } = {}) => {
  const map = new OfferingsMap();
  map.onLoaded({
    data: {
      items: range(count).map(() => FactoryBot.create('Offering', {})),
    },
  });
  return map;
};

export { FactoryBot, faker };
export default Factories;
