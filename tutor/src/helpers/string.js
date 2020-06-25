import { isNaN, isString, isEmpty } from 'lodash';

const SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const UNWORKED = '---';

export { UNWORKED };

export default {
  asPercent(num) {
    return Math.round(num * 100);
  },

  numberWithOneDecimalPlace(num) {
    return parseFloat(Math.round(parseFloat(num) * 10) / 10).toFixed(1);
  },

  numberWithTwoDecimalPlaces(num) {
    return parseFloat(Math.round(parseFloat(num) * 100) / 100).toFixed(2);
  },

  capitalize(string, lowerOthers = true) {
    const other = lowerOthers ? string.substring(1).toLowerCase() : string.substring(1);
    return string.charAt(0).toUpperCase() + other;
  },

  replaceAt(string, index, character) {
    return string.substr(0, index) + character + string.substr(index + character.length);
  },

  insertAt(string, index, character) {
    return string.substr(0, index) + character + string.substr(index);
  },

  removeAt(string, index, length = 1) {
    return string.substr(0, index) + string.substr(index + length);
  },

  getNumberAndStringOrder(string) {
    const parsedInt = parseFloat(string);
    if (isNaN(parsedInt)) { return string.toLowerCase(); } else { return parsedInt; }
  },

  dasherize(string) {
    return String(string)
      .replace(/[A-Z]/g, (char, index) => (index !== 0 ? '-' : '') + char.toLowerCase())
      .replace(/[-_\s]+/g, '-');
  },

  // originated from http://individed.com/code/to-title-case/
  titleize(string = '') {
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
  },

  toSentence(arry, join = 'and') {
    if (isString(arry)) { arry = arry.split(' '); }
    if (arry.length > 1) {
      return `${arry.slice(0, arry.length - 1).join(', ')} ${join} ${arry.slice(-1)}`;
    } else {
      return arry[0];
    }
  },

  isEmpty(s) {
    return Boolean(
      isEmpty(s) || (isString(s) && !s.match(/\S/))
    );
  },

  isUUID(uuid = '') { return UUID_REGEX.test(uuid); },

  stringToInt(string) {
    const int = parseInt(string);
    if (isNaN(int)) {
      return 0;
    }
    return int;
  },

  countWords(text) {
    if(!text) return 0;
    text = text.replace(/(^\s*)|(\s*$)/gi,'');
    text = text.replace(/[ ]{2,}/gi,' ');
    text = text.replace(/\n/gi,' ');
    return text.split(' ').length;
  },
};
