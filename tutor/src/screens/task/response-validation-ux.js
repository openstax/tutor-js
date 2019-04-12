import { isEmpty, extend, last, sample } from 'lodash';
import { observable, computed, action } from 'mobx';
import ResponseValidation from '../../models/response_validation';
import Raven from '../../models/app/raven';


const MESSAGES = [
  {
    title: 'Take another chance',
    message: 'write your answer after reviewing section OR Submit this answer',
  }, {
    title: 'Not sure? Here’s a hint',
    message: 'This question comes from section . Review and rewrite OR Submit this answer',
  }, {
    title: 'Try again',
    message: 'Take your time. Rewrite your answer after reviewing section OR Submit this answer',
  }, {
    title: 'Give it another shot',
    message: 'Answer in your own words to improve your learning. Review section OR Submit this answer',
  },
];

export
class ResponseValidationUX {

  @observable initialResponse;
  @observable retriedResponse;

  constructor({ step, validator = new ResponseValidation() }) {
    this.step = step;
    this.validator = validator;
    this.nudge = sample(MESSAGES);
  }

  @observable results = [];

  @action.bound setResponse({ target: { value } }) {
    if (this.isDisplayingNudge) {
      this.retriedResponse = value;
    } else {
      this.initialResponse = value;
    }
  }

  @action.bound async onSave() {
    if (!this.validator.isEnabled) {
      this.step.beginRecordingAnswer({ free_response: this.initialResponse });
      return;
    }
    const result = await this.validate();

    if (this.validator.isUIEnabled) {
      this.advanceUI(result);
    } else {
      this.step.beginRecordingAnswer({ free_response: result.response });
    }
    this.results.push(result);

    this.step.response_validation = { attempts: this.results };
  }

  @action async validate() {
    const nudge = this.validator.isUIEnabled ? this.nudge : null;
    const submitted = this.isDisplayingNudge ?
      this.retriedResponse : this.initialResponse;
    try {
      const reply = await this.validator.validate({
        uid: this.step.uid,
        response: submitted,
      });
      const validation = extend({}, reply.data, {
        response: submitted, nudge,
      });
      this.step.spy.response_validation = validation;
      return validation;
    } catch (err) {
      Raven.captureException(err);
      return {
        valid: true,
        exception: err.toString(),
        response: submitted,
        nudge,
      };
    }
  }

  @action advanceUI(result) {
    if (result.valid || this.isDisplayingNudge) {
      this.step.beginRecordingAnswer({ free_response: result.response });
    } else {
      this.retriedResponse = this.initialResponse;
    }
  }

  @action.bound submitOriginalResponse() {
    this.step.beginRecordingAnswer({ free_response: this.initialResponse });
  }

  @computed get submitBtnLabel() {
    return this.isDisplayingNudge ? 'Re-answer' : 'Answer';
  }

  @computed get isTextaAreaErrored() {
    return Boolean(
      this.isDisplayingNudge && this.initialResponse === this.retriedResponse
    );
  }

  @computed get isSubmitDisabled() {
    return this.isTextaAreaErrored || isEmpty(this.initialResponse);
  }

  @computed get isDisplayingNudge() {
    return Boolean(this.validator.isUIEnabled && this.results.length && !last(this.results).valid);
  }

}
