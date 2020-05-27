import moment from 'moment-timezone';
import 'moment-timezone/moment-timezone-utils';
import { isEmpty, pick, map, clone, values, first } from 'lodash';

// Map http://www.iana.org/time-zones names to timezone names in Rails
// https://github.com/openstax/tutor-server/pull/1057#issuecomment-212678167
const TIME_LINKS = {
  'US/Hawaii': 'Hawaii',
  'US/Alaska': 'Alaska',
  'US/Pacific': 'Pacific Time (US & Canada)',
  'US/Arizona': 'Arizona',
  'US/Mountain': 'Mountain Time (US & Canada)',
  'US/Central': 'Central Time (US & Canada)',
  'US/Eastern': 'Eastern Time (US & Canada)',
  'US/East-Indiana': 'Indiana (East)',
  'Canada/Atlantic': 'Atlantic Time (Canada)',
};

// uses moment-timezone-utils to alias loaded timezone data to timezone names in Rails
moment.tz.add(
  map(TIME_LINKS, (alternativeZoneName, loadedZoneName) => {
    const loadedUnpackedObject = pick(
      moment.tz.zone(loadedZoneName),
      ['abbrs', 'offsets', 'untils']
    );
    loadedUnpackedObject.name = alternativeZoneName;
    return moment.tz.pack(loadedUnpackedObject);
  })
);

// eslint-disable-next-line
const ISO_DATE_REGEX = /\d{4}[\/\-](0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])/;
const ISO_TIME_REGEX = /([01][0-9]|2[0-3]):[0-5]\d/;

const START = '^';
const END = '$';
const SEPARATOR = ' ';

const ISO_DATE_ONLY_REGEX = new RegExp(START + ISO_DATE_REGEX.source + END);
const ISO_DATETIME_REGEX = new RegExp(START + ISO_DATE_REGEX.source + SEPARATOR + ISO_TIME_REGEX.source + END);
const ISO_TIME_ONLY_REGEX = new RegExp(START + ISO_TIME_REGEX.source + END);

const TimeHelper = {
  ISO_DATE_FORMAT: 'YYYY-MM-DD',
  ISO_TIME_FORMAT: 'HH:mm',
  HUMAN_TIME_FORMAT: 'h:mm a',
  HUMAN_DATE_FORMAT: 'MM/DD/YYYY',

  toHumanDate(datething) {
    return moment(datething).format(this.HUMAN_DATE_FORMAT);
  },

  toShortHumanDateTime(datething) {
    return moment(datething).format('llll');
  },

  toISO(datething) {
    return moment(datething).format(this.ISO_DATE_FORMAT);
  },

  ISODateToMoment(datething) {
    return moment(datething, this.ISO_DATE_FORMAT);
  },

  toDateTimeISO(datething) {
    return moment(datething).format(`${this.ISO_DATE_FORMAT} ${this.ISO_TIME_FORMAT}`);
  },

  isDateStringOnly(stringToCheck) {
    return ISO_DATE_ONLY_REGEX.test(stringToCheck);
  },

  isDateTimeString(stringToCheck) {
    return ISO_DATETIME_REGEX.test(stringToCheck);
  },

  isTimeStringOnly(stringToCheck) {
    return ISO_TIME_ONLY_REGEX.test(stringToCheck);
  },

  hasTimeString(stringToCheck) {
    return ISO_TIME_REGEX.test(stringToCheck);
  },

  hasDateString(stringToCheck) {
    return ISO_DATE_REGEX.test(stringToCheck);
  },

  getTimeOnly(stringToCheck) {
    return first(stringToCheck.match(ISO_TIME_REGEX));
  },

  getDateOnly(stringToCheck) {
    return first(stringToCheck.match(ISO_DATE_REGEX));
  },

  PropTypes: {
    moment(props, propName, componentName) {
      if (!moment.isMoment(props[propName])) {
        return new Error(`${propName} should be a moment for ${componentName}`);
      }
      return null;
    },
  },

  getCurrentLocales() {
    const currentLocale = moment.localeData();

    return {
      abbr: currentLocale._abbr,
      week: currentLocale._week,
      weekdaysMin: currentLocale._weekdaysMin,
    };
  },

  syncCourseTimezone(courseTimezone) {
    if (this.isCourseTimezone(courseTimezone)) { return null; }
    if (this._local == null) { this._local = this.getLocalTimezone(); }
    const zonedMoment = moment.tz.setDefault(courseTimezone);
    return zonedMoment;
  },

  unsyncCourseTimezone() {
    if (this._local == null) { return null; }
    const unzonedMoment = moment.tz.setDefault(this._local);
    this.unsetLocal();
    return unzonedMoment;
  },

  makeMoment(value, ...args) {
    if (moment.isMoment(value)) {
      if (value instanceof moment) {
        return value.clone();
      } else {
        return moment(value._d, ...Array.from(args));
      }
    } else {
      return moment(value, ...Array.from(args));
    }
  },

  getLocalTimezone() {
    return moment.tz.guess();
  },

  getMomentPreserveDate(value, ...args) {
    const preserve = TimeHelper.makeMoment(value, ...Array.from(args));
    return preserve.hour(12).locale(moment.locale());
  },

  getZonedMoment(value, ...args) {
    const preserve = TimeHelper.makeMoment(value, ...Array.from(args));
    if (this._local) { preserve.tz(this._local); }
    return preserve.hour(12).locale(moment.locale());
  },

  getLocal() {
    return this._local;
  },

  unsetLocal() {
    return this._local = null;
  },

  getTimezones() {
    return clone(TIME_LINKS);
  },

  isTimezoneValid(timezone) {
    let needle;
    return (needle = timezone, values(TimeHelper.getTimezones()).includes(needle));
  },

  isCourseTimezone(courseTimezone) {
    if (isEmpty(courseTimezone)) { return false; }
    return moment().utcOffset() === moment.tz(courseTimezone).utcOffset();
  },
};

export default TimeHelper;
