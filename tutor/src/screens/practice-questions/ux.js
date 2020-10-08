import { action } from 'vendor';
import Courses from '../../models/courses-map';

export default class PracticeQuestionsUX {
  @action async initialize({ courseId }) {
    this.course = Courses.get(courseId);
  }
}
