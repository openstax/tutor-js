// FIXME - get real values
const AGENT_ID = '572U0000000k9cB';

export default {

  get isEnabled() {
    return !!window.liveagent;
  },

  initialize() {

    window.liveagent.init('https://d.la2-c2-dfw.salesforceliveagent.com/chat', AGENT_ID, '00DU0000000Kwch');

  },

  setButtonStatus(online, offline) {
    window.liveagent.showWhenOnline(AGENT_ID, online);
    window.liveagent.showWhenOffline(AGENT_ID, offline);
  },

  start() {
    window.liveagent.startChat(AGENT_ID);
  },
};
