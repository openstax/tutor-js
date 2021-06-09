import { isNaN, isString, isNumber, trimStart, trimEnd } from 'lodash';

const SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;


export function toNumber(value: number | string) {
    return isNumber(value) ? value : parseFloat(value)
}
export function toInt(string: string) {
    const int = parseInt(string);
    if (isNaN(int)) {
        return 0;
    }
    return int;
}
export function asPercent(num: number) {
    return Math.round(num * 100)
}

export function numberWithOneDecimalPlace(value: number | string) {
    const num = toNumber(value)
    return (Math.round(num * 10) / 10).toFixed(1)
}
export function numberWithTwoDecimalPlaces(val: number | string) {
    return (Math.round(toNumber(val) * 100) / 100).toFixed(2)
}

export function capitalize(string: string, lowerOthers = true) {
    const other = lowerOthers ? string.substring(1).toLowerCase() : string.substring(1);
    return string.charAt(0).toUpperCase() + other;
}

export function replaceAt(string: string, index: number, character: string) {
    return string.substr(0, index) + character + string.substr(index + character.length);
}

export function insertAt(string: string, index: number, character: string) {
    return string.substr(0, index) + character + string.substr(index);
}

export function removeAt(string: string, index: number, length = 1) {
    return string.substr(0, index) + string.substr(index + length);
}

export function getNumberAndStringOrder(string: string) {
    const parsedInt = parseFloat(string);
    if (isNaN(parsedInt)) { return string.toLowerCase(); } else { return parsedInt; }
}
export function dasherize(string: string) {
    return String(string)
        .replace(/[A-Z]/g, (char, index) => (index !== 0 ? '-' : '') + char.toLowerCase())
        .replace(/[-_\s]+/g, '-');
}

// originated from http://individed.com/code/to-title-case/
export function titleize(string = '') {
    return String(string)
        .replace(/_/g, ' ')
        .replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
            if ((index > 0) && ((index + match.length) !== title.length) &&
                (match.search(SMALL_WORDS) > -1) &&
                (title.charAt(index - 2) !== ':') &&
                ( (title.charAt(index + match.length) !== '-') || (title.charAt(index - 1) === '-') ) &&
                (title.charAt(index - 1).search(/[^\s-]/) < 0)) {

                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
}

export function toSentence(arry: string | string[], join = 'and') {
    if (isString(arry)) { arry = arry.split(' '); }
    if (arry.length > 1) {
        return `${arry.slice(0, arry.length - 1).join(', ')} ${join} ${arry.slice(-1)}`;
    } else {
        return arry[0];
    }
}

export function isEmpty(s: string | null | undefined): boolean {
    return Boolean(
        isEmpty(s) || (isString(s) && !s.match(/\S/))
    );
}

export function isUUID(uuid = '') { return UUID_REGEX.test(uuid); }

export function countWords(text: string) {
    if(!isString(text)) return 0;

    let trimmedText = trimStart(text);
    trimmedText = trimEnd(trimmedText);
    //https://css-tricks.com/build-word-counter-app/
    const words = trimmedText.match(/\b[-?(\w+)?]+\b/gi);
    if(!words) return 0;
    return words.length;
}

export function stripHTMLTags(text: string) {
    return isString(text) ? text.replace(/(<([^>]+)>)/ig, '') : text;
}

export default {
    toNumber,
    toInt,
    asPercent,
    numberWithOneDecimalPlace,
    numberWithTwoDecimalPlaces,
    capitalize,
    replaceAt,
    insertAt,
    removeAt,
    getNumberAndStringOrder,
    dasherize,
    titleize,
    toSentence,
    isEmpty,
    isUUID,
    countWords,
    stripHTMLTags,
};
