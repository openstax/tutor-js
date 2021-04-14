import { extend, last, random } from 'lodash';
import S from '../../helpers/string';
import { observable, computed, action, modelize } from 'shared/model';
import { Raven, ResponseValidation } from '../../models'

export
class ResponseValidationUX {

    @observable initialResponse;
    @observable retriedResponse;
    @observable messages;
    @observable messageIndex;
    @observable results = [];
    @observable wordLimit = 500;

    constructor({ step, messages, taskUX, validator = new ResponseValidation() }) {
        modelize(this);
        this.step = step;
        this.step.spy.response_validation = {};
        this.step.response_validation = {};
        this.validator = validator;
        this.messages = messages;
        this.taskUX = taskUX;
        this.initialResponse = step.free_response;
        this.messageIndex = random(0, messages.length - 1);
    }

    @computed get nudge() {
        return this.messages[this.messageIndex];
    }

    @computed get canRevert() {
        return Boolean(
            this.step.isOpenEndedExercise &&
        this.step.can_be_updated &&
        this.step.last_completed_at &&
        (!this.course.currentRole.isTeacher)
        );
    }

    @action.bound setResponse(ev) {
        if (this.taskUX.isReadOnly) {
            ev.preventDefault();
            return;
        }
        const { target: { value } } = ev;
        if (this.isDisplayingNudge) {
            this.retriedResponse = value;
        } else {
            this.initialResponse = value;
        }
    }

    @computed get response() {
        return this.isDisplayingNudge ? this.retriedResponse : this.initialResponse;
    }

    @computed get responseWords() {
        return S.countWords(this.response);
    }

    // Word limit is 500
    @computed get isOverWordLimit() {
        return this.responseWords > this.wordLimit;
    }

    @computed get course() {
        return this.taskUX.course;
    }

    @action.bound async onSave() {

        // we have text but it hasn't changed, go to next
        // allow go to next if assignment is closed
        if (!this.step.can_be_updated || (this.response && !this.textHasChanged || this.step.task.isAssignmentClosed)) {
            this.advanceUI();
            return;
        }
    
        if (!this.taskUX.canUpdateCurrentStep) {
            this.taskUX.onFreeResponseComplete(this.step, { wasModified: false });
            return;
        }
    
        if (!this.validator.isEnabled) {
            this.recordFinalResponse(this.response);
            return;
        }

        const result = await this.validate();
        this.recordResult(result)
    }

    @action recordResult(result) {
        if (this.validator.isUIEnabled) {
            this.advanceUI(result);
        } else {
            this.recordFinalResponse(result.response);
        }
        this.results.push(result);
        this.step.response_validation = { attempts: this.results };
    }

    @action recordFinalResponse(free_response) {
        this.step.beginRecordingAnswer({ free_response });
        this.taskUX.onFreeResponseComplete(this.step, { wasModified: true });
    }

    @action async validate() {
        // Nudges are only displayed on the first attempt, only save the message if it was shown.
        const nudge = this.validator.isUIEnabled && S.isEmpty(this.results) ? this.nudge.title : null;
        const submitted = this.response;
        try {
            const reply = (await this.validator.validate({
                uid: this.step.uid,
                response: submitted,
            })) || {};
            const validation = extend({}, reply, {
                timestamp: (new Date()).toISOString(),
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
                timestamp: (new Date()).toISOString(),
                nudge,
            };
        }
    }

    @action.bound cancelWRQResubmit() {
        this.results = [];
        this.initialResponse = this.step.free_response;
    }

    @action advanceUI(result) {
        if (result) {
            if (result.valid || this.isDisplayingNudge) {
                const wasModified = this.textHasChanged;
                this.step.beginRecordingAnswer({ free_response: result.response });
                this.taskUX.onFreeResponseComplete(this.step, { wasModified });
            } else {
                this.retriedResponse = this.initialResponse;
            }
        } else {
            this.taskUX.onFreeResponseComplete(this.step, { wasModified: this.textHasChanged });
        }
    }

    @action.bound submitOriginalResponse(ev) {
        ev && ev.preventDefault();
        const wasModified = this.textHasChanged;
        this.step.beginRecordingAnswer({ free_response: this.initialResponse });
        this.taskUX.onFreeResponseComplete(this.step, { wasModified });
    }

    @computed get textHasChanged() {
        return this.step.free_response !== this.initialResponse;
    }

    @computed get submitBtnLabel() {
        if (!this.taskUX.canUpdateCurrentStep){
            return 'Next';
        }
        if (this.lastSubmitted) {
            return this.textHasChanged ? 'Re-submit' : 'Next';
        }
        return 'Submit';
    }

    @computed get displayNudgeError() {
        return Boolean(
            this.isDisplayingNudge && this.initialResponse === this.retriedResponse
        );
    }

    @computed get isSubmitDisabled() {
        // enabled next button so user can click and go to next step
        if(this.step.task.isAssignmentClosed) return false;
        return Boolean(
            this.taskUX.isLocked || this.displayNudgeError || S.isEmpty(this.response) || this.isOverWordLimit,
        );
    }

    @computed get isDisplayingNudge() {
        return Boolean(
            this.validator.isUIEnabled &&
        this.results.length && !last(this.results).valid
        );
    }

    @computed get lastSubmitted() {
        return this.step.free_response && this.step.last_completed_at;
    }

}
