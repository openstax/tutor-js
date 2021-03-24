import Time from '../models/time';
import user from '../models/user';
import UserMenu from '../models/user/menu';
import { isNil, isObject } from 'lodash';

const makeContactMessage = function(
    { status, statusMessage, config = {}, location } = {}
) {
    const { userAgent } = window.navigator;
    const { data } = config;
    let msg = `Hello!\n\nI ran into a problem at ${location} while using browser:\n${userAgent}`;

    if(!isNil(status)) {
        msg += `\n\nThe request details are: ${config.method} on ${config.baseURL}/${
            config.url} returned status "${status}" with message "${statusMessage}"`;
    }

    if (data) {
        msg += `\n\nThe request body was:\n${
            isObject(data) ? JSON.stringify(data, null, 2) : data}`;
    }

    if (user) {
        msg += `\n\nUser info:\n  UUID: ${
            user.account_uuid}\n  Self-reported role: ${user.self_reported_role}`;
    }

    msg += `\n\nTime: ${Time.now}`;

    return msg;
};


const makeContactURL = function(
    { status, statusMessage, config = {} } = {}
) {
    const location = window.location.href;
    const body = encodeURIComponent(
        makeContactMessage({ status, statusMessage, config, location })
    );
    const subject = encodeURIComponent(`OpenStax Tutor Error ${status} at ${location}`);
    return `mailto:${UserMenu.supportEmail}?subject=${subject}&body=${body}`;
};

export {
    makeContactMessage,
    makeContactURL,
};
