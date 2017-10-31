import HYPOTHESIS from '../../models/hypothesis';

// Hypothesis token handshaking
const hypothesisConfig = HYPOTHESIS.sidebarConfig().services[0];
let hypothesisTokens;
(function () {
  const fetchProfile = () => {
    const xhProfile = new XMLHttpRequest();
    xhProfile.open('GET', `${hypothesisConfig.apiUrl}profile?authority=openstax.org`, true);
    xhProfile.setRequestHeader('Authorization', `Bearer ${hypothesisTokens.access_token}`);
    xhProfile.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.response);
        console.debug("Profile response:", data);
      }
    };
    xhProfile.send();
  };

  const doSearch = () => {
    const xhSearch = new XMLHttpRequest();
    xhSearch.open('GET', `${hypothesisConfig.apiUrl}search`, true);
    xhSearch.setRequestHeader('Authorization', `Bearer ${hypothesisTokens.access_token}`);
    xhSearch.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.response);
        console.debug("Search response:", data);
      }
    }
    xhSearch.send();
  };
}());


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
      this.accessToken = response.access_token;
      return response.access_token;
    });
    const gotProfile = gotToken.then(() => {
      return this.request({
        mode: 'GET',
        service: 'profile?authority="openstax.org"'
      }).then((response) => {
        this.userInfo = response.groups[0];
        return response.groups[0];
      });
    });

    this.whenLoggedIn = Promise.all([gotToken, gotProfile]);
    this.whenLoggedIn.then((foo) => {
      console.debug("LOGGED IN", foo);
    });
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(options.mode, `${hypothesisConfig.apiUrl}${options.service}`, true);
      if (this.accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
      }
      if (options.headers) {
        for (const label of Object.keys(options.headers)) {
          xhr.setRequestHeader(label, options.headers[label]);
        }
      }
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          resolve(JSON.parse(this.response));
        }
      };
      xhr.send(options.sendData);
    });
  }

  loggedInRequest(options) {
    return new Promise((resolve) => {
      this.whenLoggedIn.then(() => {
        this.request(options).then(resolve);
      });
    });
  }

  fetch(documentId) {
    return this.loggedInRequest({
      mode: 'GET',
      service: `search?uri=${documentId}&user=${this.userInfo.name}` //
    }).then((response) => {
      console.debug("GOT SEARCH RESULTS", response);
      return response;
    });
  }

  save(documentId, selection, annotation) {
    return this.loggedInRequest({
      mode: 'POST',
      service: 'annotations',
      sendData: JSON.stringify({
        uri: documentId,
        text: annotation,
        target: [{
          selector: [{
            type: 'TextPositionSelector',
            start: selection.start,
            end: selection.end
          }]
        }],
        group: this.userInfo.id
      })
    });
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
