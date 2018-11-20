const DEPLOYMENT_ID   = '572U0000000k9cB';
const ORGANIZATION_ID = '00DU0000000Kwch';
const ELEMENT_ID      = '573U0000000k9cB';

export default {

  get isEnabled() {
    return Boolean(window.liveagent);
  },

  get isOnline() {
    if (!this.isEnabled) { return false; }
    const chat = document.querySelector('.chat.enabled');
    return chat && chat.style.display !== 'none';
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
