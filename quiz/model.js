import { observable, computed } from 'vendor';
import TutorQuestionModel from 'shared/model/exercise/question';
import TutorAnswerModel from 'shared/model/exercise/answer';
import { lazyInitialize as lz } from 'core-decorators';
import dom from '../tutor/src/helpers/dom';

class XmlPart {
  constructor(xml) {
    this.xml = xml;
  }
  $(selector) {
    return this.xml.querySelector(selector);
  }
  $$(selector) {
    return Array.from(this.xml.querySelectorAll(selector));
  }
}

class Exercise extends XmlPart {
  static fromXML(xml, q) {
    const type = xml.querySelector('[itemprop="eduQuestionType"]').getAttribute('content');
    if (type == 'Multiple choice') {
      return new MCExercise(xml, q);
    }
  }

  constructor(xml, quiz) {
    super(xml);
    this.quiz = quiz;
  }

  @lz questionText = this.$('[itemprop="hasPart"] > [itemprop="text"]').innerText;
}


class MCAnswer extends XmlPart {

  @lz html = this.$('[itemprop="text"]').innerHTML;

  @lz id = this.xml.getAttribute('id');

  @lz asTutorAnswer = new TutorAnswerModel({
    id: this.id,
    content_html: this.html,
  });

  @lz isCorrect = this.xml.matches('[itemprop="acceptedAnswer"]')
}

class Quiz extends XmlPart {

  @lz exercises = this.
    $$('[itemtype="http://schema.org/Question"]')
    .map(function(xml) { return Exercise.fromXML(xml, this) });

  @lz referenceHTML = this.$('h2').innerHTML.replace('google-practice', 'ox-practice-widget')
}

class MCExercise extends Exercise {

  @observable selectedAnswerId;
  
  @lz answers = this.$$('[itemtype="http://schema.org/Answer"]').map((xml) => new MCAnswer(xml));

  @computed get asTaskStep() {
    return {
      exercise: this,
      type: 'exercise',
      isCorrect: this.isCorrect,
      is_completed: !!this.selectedAnswerId,
      answer_id: this.selectedAnswerId,
      correct_answer_id: this.correctAnswer.id,
      task: {
        title: 'Quiz',
      },
    };
  };

  @lz asTutorQuestion = new TutorQuestionModel({
    stem_html: this.questionText,
    answers: this.answers.map(a => a.asTutorAnswer),
  });

  @lz correctAnswer = this.answers.find(a => a.isCorrect)

  @computed get isCorrect() {
    if (!this.selectedAnswerId) { return null; }
    return this.selectedAnswerId == this.correctAnswer.id;
  }
}

export { Quiz, Exercise };
