import {
  BaseModel, identifiedBy
} from './base';
import {  extend } from 'lodash';
import { action, observable, when, computed } from 'mobx';
import loadjs from 'loadjs';
import { readonly } from 'core-decorators';


export default class Hypothesis {



  logFailure(msg) {
    this.errorMessage = msg;
    this.isBusy = false;
    Logging.error(msg)
  }

  initialize(config) {

    console.log('Hypothesis is initializing...');
    // Apply config items
    this.config = config;

    window.hypothesisConfig = this.loadSidebarConfig;
    this.loadSidebar()
  }

  loadSidebarConfig(){
    console.log('Loading hypothesis config obj into head');
    return {
      'services':
        {
          'apiUrl': this.config.api_url,
          'grantToken': 'blah',
          'client_id': this.config.client_id,
          'authority': this.authority
        }
    }

  }

  @action.bound
  loadSidebar() {
    console.log('load the hypothesis embed_url');
    if (!this.config.embed_url) {
      return this.logFailure('Attempted to load hypothesis without an embed_url')
    }
    this.isBusy = true;
    if (!window.hypothesisConfig) {
      console.log('no hypothesis config detected');
      return this.initialize()
    } else {
      return loadjs(this.config.embed_url, {
        success: () =>
          console.log('loading sidebar'),
        error: (e) => this.logFailure(`Unable to request assets ${e}`),
      })
    }
  }


}
