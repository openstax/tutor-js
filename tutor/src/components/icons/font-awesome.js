import { library } from '@fortawesome/fontawesome-svg-core';

const ICONS = {};

[
  'Bars',
  'Ghost',
  'QuestionCircle',
  'AngleDown',
  'TimesCircle',
  'Spinner',
  'Calendar',
  'ExclamationCircle',
  'Clock',
  'Th',
].forEach(name => {
  const icon = require(`@fortawesome/free-solid-svg-icons/fa${name}.js`);
  library.add(
    ICONS[icon.iconName] = icon.definition,
  );
});

export default ICONS;
