import { action, computed, observable } from 'vendor';
import Courses from '../../models/courses-map';
import Exercises from '../../models/exercises';

export default class PracticeQuestionsUX {

  @observable isInitializing = false;
  @observable course;

  @action async initialize({ courseId }) {
    this.isInitializing = true;
    this.course = Courses.get(courseId);
    // not refreshing
    await this.course.practiceQuestions.fetch();
    if(!this.isPracticeQuestionsEmpty) {
      await this.course.referenceBook.ensureLoaded();
      await Exercises.fetch(
        { 
          course: this.course,
          exercise_ids: this.course.practiceQuestions.getAllExerciseIds(), 
        });
    }
    this.isInitializing = false;
  }

  /**
   * Needs to clear the exercises when unmounting.
   * Otherwise it will still have the same exercises even if students deletes from the assignments.
   */
  @action clear() {
    Exercises.clear();
  }

  @computed get isPracticeQuestionsEmpty() {
    return this.course.practiceQuestions.isEmpty;
  }

  @computed get exercises() {
    return Exercises;
  }

  @action async deletePracticeQuestion(exerciseId) {
    const practiceQuestion = this.course.practiceQuestions.findByExerciseId(exerciseId);
    await practiceQuestion.destroy();
    // after the practice question was deleted from the api, delete it from exercises also.
    this.exercises.deleteByExerciseId(parseInt(exerciseId, 10));
  }
}
