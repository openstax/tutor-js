import { UserMenu } from '../models';
import { isNil, isObject } from 'lodash';

const makeContactMessage = function(
    { status, statusMessage, config = {}, location } = {}
) {
    const { userAgent } = window.navigator;
    const { data } = config;
    let reqDetails;
    let msg = `Hello!

  I ran into a problem at ${location} while using browser
  ${userAgent}.\n`;

    if (!isNil(status)) {
        reqDetails = `${config.method} on ${config.url} returned status "${status}" with message "${statusMessage}"\n\n`;
    }
    if (data) {
        reqDetails += `The request body was:\n${isObject(data) ? JSON.stringify(data, null, 2) : data}`;
    }

    if(reqDetails) {
        msg += `\nThe request details are:\n${reqDetails}.`;
    }

    return msg;
};


const makeContactURL = function(
    { status, statusMessage, config = {} } = {}
) {
    const location = window.location.href;
    const body = encodeURIComponent(makeContactMessage({ status, statusMessage, config, location }));
    const subject = encodeURIComponent(`OpenStax Tutor Error ${status} at ${location}`);
    return `mailto:${UserMenu.supportEmail}?subject=${subject}&body=${body}`;
};

export {
    makeContactMessage,
    makeContactURL,
};
