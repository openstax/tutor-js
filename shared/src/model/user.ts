import { extend, first, map, filter } from 'lodash';
import Networking from './networking';
import URLs from './urls';
import EventEmitter2 from 'eventemitter2';

const ERROR_CODES = {
    pin_not_correct: 'Invalid PIN code',
    no_pin_confirmation_attempts_remaining: 'Too many PIN attempts',
};

class Email extends (EventEmitter2 as any) {

    constructor(user: User, attrs: any) {
        super(); // eslint-disable-line constructor-super
        this.user = user;
        extend(this, attrs);
    }

    sendVerification(pin: any, successCallBack: any) {
        return this.makeRequest('confirm_by_pin', { pin }).then(resp => {
            if (!resp) return;
            if (resp.status === 204) {
                delete this.error;
                this.is_verified = true;
                successCallBack(this);
            } else {
                const code = first<any>(resp.data?.errors || [{ code: '' }]).code;
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

    makeRequest(type: any, data = {}) {
        this.requestInProgress = true;

        const afterRequest = (resp:any) => {
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

class User extends (EventEmitter2 as any) {

    static current() {
        return this._current_user;
    }

    static setCurrent(data: any) {
        return this._current_user = new User(data);
    }

    constructor(data: any) {
        super(); // eslint-disable-line constructor-super
        this.attibutes = data;
        this.emails = map(this.attibutes.contact_infos, ci => new Email(this, ci));
    }

    unVerfiedEmails() {
        return filter(this.emails, { is_verified: false });
    }
}

export default User;
