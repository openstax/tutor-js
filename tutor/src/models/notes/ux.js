import { observable, action, computed } from 'mobx';
import { readonly } from 'core-decorators';

const ERROR_DISPLAY_TIMEOUT = 1000 * 4;

class StatusMessage {

  @observable display = false;
  @observable type;
  @observable message;
  @observable hideTimer;

  @computed get icon() {
      if (this.type === 'error') { return 'exclamation-triangle'; }
      return 'info-circle';
  }

  @action.bound hide() {
      this.display = false;
      this.hideTimer = null;
  }

  show({ message, type = 'error', autoHide = false }) {
      if (this.hideTimer) {
          clearTimeout(this.hideTimer);
          this.hideTimer = null;
      }

      Object.assign(this, {
          display: true, message, type,
      });

      if (autoHide) {
          this.hideTimer = setTimeout(
              this.hide, ERROR_DISPLAY_TIMEOUT
          );
      }
  }

}

class AnnotatorUX {

  @observable isSummaryVisible = false;

  @action.bound hideSummary() {
      this.isSummaryVisible = false;
  }

  @action.bound toggleSummary() {
      this.isSummaryVisible = !this.isSummaryVisible;
  }

  @readonly statusMessage = new StatusMessage();

}

const ux = new AnnotatorUX();

export default ux;
