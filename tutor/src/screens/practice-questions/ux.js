import { action, computed } from 'vendor';
import Courses from '../../models/courses-map';
import Exercises from '../../models/exercises';

export default class PracticeQuestionsUX {
  @action async initialize({ courseId }) {
    this.course = Courses.get(courseId);
    await this.course.practiceQuestions.fetch();
    
    if(!this.isPracticeQuestionsEmpty) {
      await this.course.referenceBook.ensureLoaded();
      await Exercises.fetch(
        { course: this.course,
          exercise_ids: this.course.practiceQuestions.getAllExerciseIds(), 
        });
    }
  }

  @computed get isPracticeQuestionsEmpty() {
    return this.course.practiceQuestions.isEmpty;
  }

  @computed get isExercisesLoading() {
    return Exercises.api.isPending;
  }

  @computed get exercises() {
    return Exercises;
  }
}
