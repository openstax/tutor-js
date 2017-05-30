// FIXME - get real values
const DEPLOYMENT_ID = '572U0000000k9cB';
const ORGANIZATION_ID = '00DU0000000Kwch';
import { computed } from 'mobx';
import User from './user';

export default {

  @computed get isEnabled() {
    return window.liveagent && (User.isConfirmedFaculty || User.self_reported_role !== 'student');
  },

  initialize() {
    window.liveagent.init('https://d.la2-c2-dfw.salesforceliveagent.com/chat', DEPLOYMENT_ID, ORGANIZATION_ID);
    window.liveagent.enableLogging()

  },

  setElementVisiblity(online, offline) {
    console.log(online, offline)
    window.liveagent.showWhenOnline(DEPLOYMENT_ID, online);
    window.liveagent.showWhenOffline(DEPLOYMENT_ID, offline);
  },

  start() {
    window.liveagent.startChat(DEPLOYMENT_ID);
  },

};
