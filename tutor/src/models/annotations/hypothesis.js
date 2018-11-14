import {
  BaseModel, field, identifiedBy,
} from 'shared/model';
import axios from 'axios';
import { action, observable, computed } from 'mobx';
import { isEmpty, defaultsDeep, find } from 'lodash';
import { Logging } from 'shared';
import { AppActions } from '../../flux/app';

@identifiedBy('hypotheis')
class Hypothesis extends BaseModel {

  @action.bound
  bootstrap(data = {}) {
    if (isEmpty(data)) {
      // eslint-disable-next-line no-console
      console.warn('Hypothesis configuration is missing');
    }
    this.update(data);
  }

  @observable isBusy;
  @observable errorMessage;
  @field api_url;
  @field authority;
  @field grant_token;

  @observable userInfo;
  @observable accessToken;

  @observable errorMessage = '';
  @observable isBusy;

  @computed get isConfigured() {
    return Boolean(this.api_url);
  }

  @action.bound
  logFailure(msg) {
    this.errorMessage = msg;
    this.isBusy = false;
    Logging.error(msg);
  }

  // performs multiple fetches
  //  * First the user token
  //  * Then the user's info (mainly uuid)
  //  * And finally resolves with all the user's annotations
  @action fetchUserInfo() {
    return this.whenLoggedIn = this.performRequest({
      method: 'POST',
      service: 'token',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${this.grant_token}`,
    }).then((response) => {
      if (response) {
        this.accessToken = response.access_token;
      }
    }).then(() => {
      if (this.accessToken) {
        return this.performRequest({
          service: 'profile?authority=openstax.org',
        }).then((response) => {
          this.userInfo = find(response.groups, { public: false });
          return this.fetchAllAnnotations();
        });
      } else { return this; }
    }).catch(err => {
      AppActions.setServerError(err);
    });
  }

  // options can be an object or a function returning an object, which will
  // be evaulated after logging in
  request(options) {
    return new Promise((resolve) => {
      this.whenLoggedIn.then(() => {
        const actualOptions = typeof options === 'function' ? options() : options;
        this.performRequest(actualOptions).then(resolve);
      });
    });
  }

  create(documentId, selection, annotation, additionalData) {
    return this
      .request(() => ({
        method: 'POST',
        service: 'annotations',
        data: {
          uri: documentId,
          text: annotation,
          target: [{
            selector: [
              additionalData
            ],
          }],
          group: this.userInfo.id,
        },
      }));

  }

  fetchAllAnnotations() {
    const perFetch = 100;
    let rows = [];
    const fetchASet = () => this.performRequest({
      service: `search?user=${this.userInfo.name}&limit=${perFetch}&offset=${rows.length}`,
    });
    const promiseBody = (resolve) => {
      fetchASet().then((response) => {

        if (response.rows.length > 0) {
          rows = rows.concat(response.rows);
          promiseBody(resolve);
        } else {
          resolve(rows);
        }
      });
    };
    return new Promise(promiseBody);
  }


  // a private method; not called from outside Hypothesis class
  // normal access will be to use "request" which makes sure token is fetched first
  performRequest(options) {
    const headers = this.accessToken ?
      { Authorization: `Bearer ${this.accessToken}` } : {};
    return axios(defaultsDeep(options, {
      baseURL: this.api_url,
      url: options.service,
      responseType: 'json',
      headers,
    }))
      .then((axiosResponse) => {
        if (axiosResponse.data) {
          return axiosResponse.data
        } else {
          throw new Error(`server returned malformed response: ${JSON.stringify(axiosResponse)}`);
        }
      });
  }


}

export default new Hypothesis();
