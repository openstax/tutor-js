const DEPLOYMENT_ID   = '572U0000000k9cB';
const ORGANIZATION_ID = '00DU0000000Kwch';
const ELEMENT_ID      = '573U0000000k9cB';

import { computed } from 'mobx';
import User from './user';

export default {

  @computed get isEnabled() {
    return Boolean(window.liveagent && User.isProbablyTeacher);
  },

  initialize() {
    if (this.isEnabled) {
      window.liveagent.init('https://d.la2-c2-dfw.salesforceliveagent.com/chat', DEPLOYMENT_ID, ORGANIZATION_ID);
    }
    // will emit debugging info to the console
    // liveagent.enableLogging();
  },

  setElementVisiblity(online, offline) {
    if (this.isEnabled) {
      window.liveagent.showWhenOnline(ELEMENT_ID, online);
      if (offline) {
        window.liveagent.showWhenOffline(ELEMENT_ID, offline);
      }
    }
  },

  start() {
    window.liveagent.startChat(ELEMENT_ID);
  },

};
