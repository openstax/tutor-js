import { Raven } from '../models'

const DEPLOYMENT_ID   = '5724P000000ghju';
const ORGANIZATION_ID = '00DU0000000Kwch';
const ELEMENT_ID      = '5736f000000k9eQ';


const win = window as any

export const Chat = {
    initialized: false,

    get isEnabled() {
        return Boolean(win.liveagent);
    },

    get isOnline() {
        if (!this.isEnabled) { return false; }
        const chat = document.querySelector<HTMLDivElement>('.chat.enabled');
        return chat && chat.style.display !== 'none';
    },

    initialize() {
    // will emit debugging info to the console
    // liveagent.enableLogging();
    },

    setElementVisiblity(online: any, offline?: any) {
        if (!this.isEnabled) { return; }
        try {
            win.liveagent.showWhenOnline(ELEMENT_ID, online);
            if (offline) {
                win.liveagent.showWhenOffline(ELEMENT_ID, offline);
            }
            if (!this.initialized) {
                win.liveagent.init('https://d.la1-c2-ia5.salesforceliveagent.com/chat', DEPLOYMENT_ID, ORGANIZATION_ID);
                this.initialized = true;
            }
        } catch(err) {
            Raven.captureException(err);
        }
    },

    start() {
        win.liveagent.startChat(ELEMENT_ID);
    },

};
