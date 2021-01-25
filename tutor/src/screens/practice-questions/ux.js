import { action, computed, observable } from 'vendor';
import Courses from '../../models/courses';
import Exercises from '../../models/exercises';
import Router from '../../helpers/router';

export default class PracticeQuestionsUX {

  @observable isInitializing = false;
  @observable course;

  @action async initialize({ courseId, history }) {
    this.isInitializing = true;
    this.course = Courses.get(courseId);

    // if existing practice exists, it will redirect to that practice step
    await this.checkExistingPractice(history);

    await this.practiceQuestions.fetch();
    if(!this.isPracticeQuestionsEmpty) {
      await this.course.referenceBook.ensureLoaded();
      this.clear();
      await Exercises.fetch(
        {
          course: this.course,
          exercise_ids: this.practiceQuestions.getAllExerciseIds(),
          action: 'practice_exercises',
        });
    }
    this.isInitializing = false;
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
    return Exercises;
  }

  /**
   * Needs to clear the exercises when unmounting.
   * Otherwise it will still have the same exercises even if students deletes from the assignments.
   */
  @action clear() {
    Exercises.clear();
  }
}
