import { debounce, isNil, get, isObject } from 'lodash';
import { toJS, observable } from 'mobx';
import URLs from './urls';
import Networking from './networking';

const SETTINGS = observable.map();

const saveSettingsDefaultImpl = debounce( () =>
    Networking.perform({
        method: 'PUT',
        url: URLs.construct('tutor_api', 'user', 'ui_settings'),
        withCredentials: true,
        silenceErrors: true,
        onError: (err: any) => {
            const code = get(err, 'response.data.errors[0].code');
            if (code === 'ui_settings_is_too_long') {
                SETTINGS.clear();
            }
        },
        data: {
            ui_settings: SETTINGS.toJSON(),
        },
    }), 500,
);

let saveSettings = saveSettingsDefaultImpl;

const UiSettings = {
    initialize(settings: any, saver = saveSettingsDefaultImpl) {
        saveSettings = saver;
        return SETTINGS.replace(observable.object(settings));
    },

    get(key:string, id?: string|number) {
        const obj = SETTINGS.get(key);
        if (!isNil(id) && isObject(obj)) { return obj[id]; } else { return obj; }
    },

    has(key: string) {
        return SETTINGS.has(key);
    },

    set(key:any, id?:any, value?:any) {
        if (isObject(key)) {
            SETTINGS.merge(key);
        } else {
            if (isNil(value)) {
                SETTINGS.set(key, id);
            } else {
                let obj = SETTINGS.get(key) || {};
                if (!isObject(obj)) {
                    obj = {};
                } else {
                    obj = toJS(obj);
                }
                obj[id] = value;
                SETTINGS.set(key, observable(obj));
            }
        }
        return saveSettings();
    },

    // for use by specs to reset
    _reset() {
        SETTINGS.clear();
        saveSettings = saveSettingsDefaultImpl;
    },

    // for debugging purposes
    _dump() { return SETTINGS.toJSON(); },
};

export default UiSettings;
