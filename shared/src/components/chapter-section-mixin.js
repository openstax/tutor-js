import { formatSection, defaults } from '../helpers/step-content';

export default {
  getDefaultProps() {
    return defaults;
  },

  sectionFormat(section, separator) {
    return formatSection(section, separator, this.props);
  },
};
