import { action, computed, observable, modelize, runInAction } from 'vendor';
import { currentExercises, currentCourses } from '../../models'
import Router from '../../helpers/router';

export default class PracticeQuestionsUX {
    @observable isInitializing = false;
    @observable course;

    constructor() {
        modelize(this);
    }

    @action async initialize({ courseId, history }) {
        this.isInitializing = true;
        this.course = currentCourses.get(courseId);

        // if existing practice exists, it will redirect to that practice step
        await this.checkExistingPractice(history);

        await this.practiceQuestions.fetch();
        if(!this.isPracticeQuestionsEmpty) {
            await this.course.referenceBook.ensureLoaded();
            this.clear();
            await currentExercises.fetch(
                {
                    course: this.course,
                    exercise_ids: this.practiceQuestions.getAllExerciseIds(),
                    action: 'practice_exercises',
                });
        }
        runInAction(() => {
            this.isInitializing = false;
        })
    }

    async checkExistingPractice(history) {
        await this.practiceQuestions.checkExisting();
    
        if(this.practiceQuestions.current_task_id) {
            history.push(
                Router.makePathname(
                    'viewTask',
                    { courseId: this.course.id, 
                        id: this.practiceQuestions.current_task_id,
                    }
                ));
        }
    }

    @computed get practiceQuestions() {
        return this.course.practiceQuestions;
    }

    @computed get isPracticeQuestionsEmpty() {
        return this.practiceQuestions.isEmpty;
    }

    @computed get exercises() {
        return currentExercises;
    }

    /**
   * Needs to clear the exercises when unmounting.
   * Otherwise it will still have the same exercises even if students deletes from the assignments.
   */
    @action clear() {
        currentExercises.clear();
    }
}
