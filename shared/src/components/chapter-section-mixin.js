import { formatSection, defaultSettings } from '../helpers/step-content';

export default {
  getDefaultProps() {
    return defaultSettings;
  },

  sectionFormat(section, separator) {
    return formatSection(section, separator, this.props);
  },
};
