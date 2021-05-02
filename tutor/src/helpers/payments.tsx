import React from 'react'
import { BaseModel, modelize } from 'shared/model';
import { merge, extend } from 'lodash';
import { action, observable, when, computed } from 'mobx';
import loadjs from 'loadjs';
import { readonly } from 'core-decorators';
import invariant from 'invariant';
import { NotificationActions, Logging } from 'shared';
import type { Course, User } from '../models'
import { Purchase } from '../models'
import { SUPPORT_EMAIL } from '../config'
import { Chat } from './chat';

const REQUIRED_OPTIONS = [
    'course',
];

export class Payments extends BaseModel {

    @readonly static config = observable({
        base_url: '',
        js_url: '',
        is_enabled: false,
        product_uuid: '',
    });

    static bootstrap(data: any) {
        extend(this.config, data);
        Purchase.invoice_base_url = data.base_url
    }

    @observable pendingTimeout: any
    @observable errorMessage: any
    @observable element: HTMLElement | null = null
    @observable parentCallbacks: any
    @observable options: any
    @observable remote: any

    constructor(options: {user: User, course: Course, windowImpl?: any, timeoutLength?: number }) {
        super();
        modelize(this);
        this.options = merge({
            timeoutLength: 60000,
            messageHandlers: {
                timeout: this.onTimeout,
                chat: Chat.isOnline ? this.onChat : null,
            },
        }, options);

        REQUIRED_OPTIONS.forEach((key) =>
            invariant(this.options[key], `option ${key} was not set for payments`));

        when(
            () => !!this.element,
            this.fetch,
        );
    }

    close() {
        if (this.remote) {
            this.remote.close();
        }
    }

    @computed get isBusy() {
        return Boolean(this.pendingTimeout);
    }

    @computed get callbacks() {
        return extend({}, this.parentCallbacks, {

        });
    }

    @computed get hasError() {
        return Boolean(this.errorMessage);
    }

    @action.bound async fetch() {
        if (!Payments.config.js_url) { return this.logFailure('Attempted to load payments without a url set'); }
        this.pendingTimeout = setTimeout(this.onTimeout, this.options.timeoutLength);
        if (this.OSaymentClass) { // may already be loaded
            return this.createIframe();
        } else {
            return loadjs(Payments.config.js_url, {
                success: this.createIframe,
                error: this.onTimeout,
            });
        }
    }

    @action.bound
    onChat() { // we're ignoring the error, not sure how to prefill chat
        const chatLink = document.querySelector<HTMLLinkElement>('.chat.enabled a');
        if (chatLink) { chatLink.click(); }
    }

    @action.bound
    onTimeout() {
        this.logFailure('Payments load timed out');
        this.errorMessage = (
            <p>
                Sorry, we’re unable to process a payment right now. Please try again,
                and if the problem persists please
                contact <a href={`mailto:${SUPPORT_EMAIL}`}>Customer Support</a>.
            </p>
        );
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
    }

    logFailure(msg: string) {
        this.errorMessage = msg;
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
        //@ts-ignore
        Logging.error(msg);
    }

    get remotePaymentOptions() {
        const { options: { user, course } } = this;
        return extend({}, this.options, {
            product_uuid: Payments.config.product_uuid,
            purchaser_account_uuid: user.account_uuid,
            registration_date: course.primaryRole.joined_at,
            product_instance_uuid: course.userStudentRecord.uuid,
            course_uuid: course.uuid,
        });
    }

    get OSaymentClass() {
        return (this.options.windowImpl || window)['OSPayments'];
    }

    @action.bound
    createIframe() {
        this.remote = new this.OSaymentClass(this.remotePaymentOptions);
        this.remote.createIframe(this.element).then(() => {
            clearTimeout(this.pendingTimeout);
            this.pendingTimeout = null;
        });
    }

}

NotificationActions.on('tutor-update', ({ payments }: {payments: any}) => {
    // eslint-disable-next-line
  extend(Payments.config, payments);
});
