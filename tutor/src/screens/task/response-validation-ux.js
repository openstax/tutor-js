import { isEmpty, extend } from 'lodash';
import { observable, computed, action, when } from 'mobx';
import ResponseValidation from '../../models/response_validation';

export
class ResponseValidationUX {

  @observable initialResponse;
  @observable retriedResponse;

  constructor({ step, validator = new ResponseValidation() }) {
    this.step = step;
    this.validator = validator;
    this.nudgeMessage = 'Rewrite your answer after reviewing section';
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
      this.step.free_response = this.initialResponse;
      return;
    }

    const result = await this.validate();
    if (this.validator.isUIEnabled) {
      this.advanceUI(result);
    }
    this.step.response_validation = { attempts: this.results };
  }

  @action async validate() {
    const submitted = this.isDisplayingNudge ?
      this.retriedResponse : this.initialResponse;
    const reply = await this.validator.validate({
      uid: this.step.uid,
      response: submitted,
    });

    return extend({}, reply.data, {
      response: submitted,
      nudgeMessage: this.nudgeMessage,
    });
  }

  @action advanceUI(result) {
    if (this.isDisplayingNudge) {
      this.step.free_response = this.retriedResponse;
    } else {
      this.retriedResponse = this.initialResponse;
    }
    this.results.push(result);
  }

  @action.bound submitOriginalResponse() {
    this.step.free_response = this.initialResponse;
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
    return Boolean(this.results.length);
  }

}
