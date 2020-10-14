import { action, computed, observable } from 'vendor';
import Courses from '../../models/courses-map';
import Exercises from '../../models/exercises';

export default class PracticeQuestionsUX {

  @observable isInitializing = false;
  @observable course;

  @action async initialize({ courseId }) {
    this.isInitializing = true;
    this.course = Courses.get(courseId);
    await this.course.practiceQuestions.fetch();
    
    if(!this.isPracticeQuestionsEmpty) {
      await this.course.referenceBook.ensureLoaded();
      await Exercises.fetch(
        { course: this.course,
          exercise_ids: this.course.practiceQuestions.getAllExerciseIds(), 
        });
    }

    this.isInitializing = false;
  }

  @computed get isPracticeQuestionsEmpty() {
    return this.course.practiceQuestions.isEmpty;
  }

  @computed get exercises() {
    return Exercises;
  }
}
