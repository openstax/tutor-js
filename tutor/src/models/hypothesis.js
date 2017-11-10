import {
  BaseModel, field, identifiedBy
} from './base';
import { action, observable, when, computed } from 'mobx';
import loadjs from 'loadjs';
import {Logging } from 'shared';

@identifiedBy('hypotheis')
class Hypothesis extends BaseModel {

  @action.bound
  bootstrap(data) {
    this.update(data);
  }

  @observable isBusy;
  @observable errorMessage;
  @field embed_url;
  @field api_url;
  @field authority;
  @field grant_token;

  @action.bound
  logFailure(msg) {
    this.errorMessage = msg;
    this.isBusy = false;
    Logging.error(msg)
  }

  initialize() {
    window.hypothesisConfig = this.sidebarConfig;
  }

  @action.bound
  sidebarConfig() {
    return {
      'services':
        [{
          'apiUrl': this.api_url,
          'grantToken': this.grant_token,
          'clientId': this.client_id,
          'authority': this.authority
        }]
    }
  }

  @action.bound
  loadSidebar() {
    if (!this.embed_url) {
      return this.logFailure('Attempted to load hypothesis without an embed_url')
    }
    this.isBusy = true;
    if (!window.hypothesisConfig) {
      logFailure('No window.hypothesisConfig detected');
    } else {
      return loadjs(this.embed_url, {
        error: (e) => this.logFailure(`Unable to request assets ${e}`),
      })
    }
  }
}

const hypothesis = new Hypothesis;
export default hypothesis
