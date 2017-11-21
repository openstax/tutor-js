import HYPOTHESIS from '../../models/hypothesis';
import axios from 'axios';

// Hypothesis token handshaking
const hypothesisConfig = HYPOTHESIS.config().services[0];
let hypothesisTokens;

class HypothesisStore {

  constructor() {
    const gotToken = this.request({
      mode: 'POST',
      service: 'token',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      sendData: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${hypothesisConfig.grantToken}`
    }).then((response) => {
      return this.accessToken = response.access_token;
    });

    const gotProfile = gotToken.then(() => {
      return this.request({
        mode: 'GET',
        service: 'profile?authority=openstax.org'
      }).then((response) => {
        return this.userInfo = response.groups[0];
      });
    });

    this.whenLoggedIn = Promise.all([gotToken, gotProfile]);
  }

  request(options) {
    return axios({
      method: options.mode,
      baseURL: hypothesisConfig.apiUrl,
      url: options.service,
      responseType: 'json',
      headers: Object.assign({},
        options.headers,
        this.accessToken ? {Authorization: `Bearer ${this.accessToken}`} : {}
      ),
      data: options.sendData
    }).then((axiosResponse) => {
      return axiosResponse.data;
    });
  }

  // options can be an object or a function returning an object, which will
  // be evaulated after logging in
  loggedInRequest(options) {
    return new Promise((resolve) => {
      this.whenLoggedIn.then(() => {
        const actualOptions = typeof options === 'function' ? options() : options;

        this.request(actualOptions).then(resolve);
      });
    });
  }

  fetch(documentId) {
    return this.loggedInRequest(() => ({
      mode: 'GET',
      service: `search?uri=${documentId}&user=${this.userInfo.name}`,
      limit: 200
    })).then((response) => {
      return response;
    });
  }

  fetchAll() {
    const perFetch = 100;
    let rows = [];
    const fetchASet = () => this.loggedInRequest(() => ({
      mode: 'GET',
      service: `search?user=${this.userInfo.name}&limit=${perFetch}&offset=${rows.length}`
    }));
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

  save(documentId, selection, annotation, additionalData) {
    return this.loggedInRequest(() => ({
      mode: 'POST',
      service: 'annotations',
      sendData: JSON.stringify({
        uri: documentId,
        text: annotation,
        target: [{
          selector: [
            Object.assign({type: 'TextPositionSelector'}, additionalData, selection)
          ]
        }],
        group: this.userInfo.id
      })
    }));
  }

  update(selectionId, annotation) {
    return this.loggedInRequest({
      mode: 'PATCH',
      service: `annotations/${selectionId}`,
      sendData: JSON.stringify({
        text: annotation
      })
    });
  }

  delete(selectionId) {
    return this.loggedInRequest({
      mode: 'DELETE',
      service: `annotations/${selectionId}`
    }).then((response) => {
      return response;
    });
  }

}

export default new HypothesisStore();
