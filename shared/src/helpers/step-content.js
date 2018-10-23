import _ from 'underscore';

const defaultSettings = {
  sectionSeparator: '.',
  skipZeros: true,
  inputStringSeparator: '.',
};

const stepContentHelper = {
  defaults:
    defaultSettings,

  formatSection(section, separator, settings = defaultSettings) {
    let sectionArray;
    const { inputStringSeparator, skipZeros, sectionSeparator } = settings;

    if (_.isString(section)) {
      sectionArray = section.split(inputStringSeparator);
    }

    if (_.isArray(section)) { sectionArray = section; }
    // prevent mutation
    sectionArray = _.clone(sectionArray);
    // ignore 0 in chapter sections
    if (skipZeros && (_.last(sectionArray) === 0)) { sectionArray.pop(); }

    if (sectionArray instanceof Array) {
      return sectionArray.join(separator || sectionSeparator);
    } else {
      return section;
    }
  },
};

export default stepContentHelper;
