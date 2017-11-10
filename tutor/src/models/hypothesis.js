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

  @field embed_url;
  @field api_url;
  @field authority;
  @field grant_token;

  @observable errorMessage = '';
  @observable isBusy;

  @action.bound
  logFailure(msg) {
    this.errorMessage = msg;
    this.isBusy = false;
    Logging.error(msg)
  }

  @action.bound
  config() {
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

}

export default new Hypothesis
