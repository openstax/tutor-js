import {
    BaseModel,
    model,
    observable,
    computed,
    model,
    field,
    modelize,
    NEW_ID,
} from 'shared/model';
import {
    get, flatMap, groupBy, find, isEmpty, keys,
} from 'lodash';
import { getters } from '../../../helpers/computed-property';
import { lazyInitialize } from 'core-decorators';
import ChapterSection from '../../chapter-section';
import Exercise from '../../exercises/exercise';
import { ReviewQuestion } from 'shared/model/exercise/question';

class AnswerStat extends BaseModel {
    @observable answer_id;
    @observable selected_count;

    @model('task-plan/stats/question') question;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get isCorrect() {
        return this.correctness > 0;
    }

    @computed get content() {
        return find(get(this.question.content, 'answers'), a => a.id == this.answer_id) || {};
    }

    @computed get id() { return this.answer_id; }

    @computed get correctness() {
        return this.content.correctness;
    }
    @computed get content_html() {
        return this.content.content_html;
    }
}

class Student extends BaseModel {

  @field id = NEW_ID;
  @field name;

}

class Answer extends BaseModel {
    @observable free_response;
    @observable answer_id;
    @model('task-plan/stats/question') students;
    @model('task-plan/stats/question') question;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get selected_count() {
        return find(this.question.answer_stats, anst => anst.answer_id == this.answer_id).selected_count || 0;
    }

    @computed get exerciseAnswer() {
        return this.question.content.answers.find(ea => ea.id == this.answer_id);
    }

    @computed get isCorrect() {
        return Boolean(this.exerciseAnswer && this.exerciseAnswer.isCorrect);
    }
}

const AnswersAssociation = {
    withFreeResponse() {
        return this.filter(ans => !isEmpty(ans.free_response));
    },
};

class QuestionStats extends BaseModel {
    @observable question_id;
    @observable answered_count;
    @observable exercise;

    @model(Answer) answers; // extend: AnswersAssociation
    @model(AnswerStat) answer_stats; /* extend: getters({
        correct() { return find(this, { isCorrect: true }); },
    }) */

    @lazyInitialize forReview = new ReviewQuestion(this);


    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }


    @computed get hasFreeResponse() {
        return find(this.answers, a => !isEmpty(a.free_response));
    }

    @computed get content() {
        return find(this.exercise.content.questions, q =>
            q.id == this.question_id
        ) || {};
    }

    answerForStudent(student) {
        for (let i in this.answers) {
            const answer = this.answers[i];
            const st = answer.students.find(s => s.id == student.id);
            if (st) {
                return answer;
            }
        }
        return null;
    }
}

class Page extends BaseModel {
    @field id = NEW_ID;
    @field({ model: ChapterSection }) chapter_section
    @observable title;
    @observable correct_count;
    @observable incorrect_count;
    @observable is_trouble;
    @observable student_count;

    @model('task-plan/stats/question') exercises;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }
}

class Stats extends BaseModel {
    @observable period_id;
    @observable name;
    @observable total_count;
    @observable complete_count;
    @observable partially_complete_count;
    @model('task-plan/stats/question') taskPlan;
    @observable is_trouble;
    @model('task-plan/stats/question') current_pages;
    @model('task-plan/stats/question') spaced_pages;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get exercises() {
        return flatMap(['current_pages', 'spaced_pages'], pageType => {
            return flatMap(this[pageType], pg => pg.exercises);
        });
    }

    @computed get questions() {
        return flatMap(this.exercises, 'content.questions');
    }

    statsForQuestion(question) {
        for (const ex of this.exercises) {
            const q = ex.question_stats.find(qs => qs.question_id == question.id);
            if (q) { return q; }
        }
        return null;
    }

    @computed get exercisesBySection() {
        return groupBy(this.exercises, ex => ex.page.chapter_section.asString);
    }

    @computed get sections() {
        return keys(this.exercisesBySection);
    }
}

export default class TaskPlanStats extends BaseModel {
    @field id = NEW_ID;
    @observable title;
    @observable type;

    @observable shareable_url;

    @model('task-plan/stats/question') stats;

    @model('task-plan/stats/question') taskPlan;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    fetch() { return { id: this.taskPlan.id }; }
    fetchReview() { return { id: this.taskPlan.id }; }
}

export { QuestionStats, Page, Stats };
