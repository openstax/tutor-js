import { extend, first, map, filter } from 'lodash';
import Networking from './networking';
import URLs from './urls';
import EventEmitter2 from 'eventemitter2';

const ERROR_CODES = {
    pin_not_correct: 'Invalid PIN code',
    no_pin_confirmation_attempts_remaining: 'Too many PIN attempts',
};

class Email extends EventEmitter2 {

    constructor(user, attrs) {
        super();
        this.user = user;
        extend(this, attrs);
    }

    sendVerification(pin, successCallBack) {
        return this.makeRequest('confirm_by_pin', { pin }).then(resp => {
            if (!resp) return;
            if (resp.status === 204) {
                delete this.error;
                this.is_verified = true;
                successCallBack(this);
            } else {
                const code = __guard__(first(resp.data != null ? resp.data.errors : undefined), x => x.code);
                this.error = ERROR_CODES[code];
                if (code === 'no_pin_confirmation_attempts_remaining') {
                    this.verificationFailed = true;
                }
            }
            this.emit('change');
        });
    }


    sendConfirmation() {
        return this.makeRequest('resend_confirmation', { send_pin: true }).then(resp => {
            if (!resp) return;
            this.verifyInProgress = (resp.status === 204);
            this.emit('change');
        });
    }

    makeRequest(type, data = {}) {
        this.requestInProgress = true;

        const afterRequest = resp => {
            this.requestInProgress = false;
            this.emit('change');
            return resp;
        };
        return Networking.perform({
            method: 'PUT',
            silenceErrors: true,
            url: URLs.construct('accounts_api', 'contact_infos', this.id, `${type}.json`),
            withCredentials: true,
            data,
        }).catch(afterRequest).then(afterRequest);
    }
}

class User extends EventEmitter2 {

    static current() {
        return this._current_user;
    }

    static setCurrent(data) {
        return this._current_user = new User(data);
    }

    constructor(data) {
        super();
        this.attibutes = data;
        this.emails = map(this.attibutes.contact_infos, ci => new Email(this, ci));
    }

    unVerfiedEmails() {
        return filter(this.emails, { is_verified: false });
    }
}

export default User;

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
