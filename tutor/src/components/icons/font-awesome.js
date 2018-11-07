import { library } from '@fortawesome/fontawesome-svg-core';

const ICONS = {};


// regular
[
  'Calendar',
  'Comments',
].forEach(name => {
  const icon = require(`@fortawesome/free-regular-svg-icons/fa${name}.js`);
  library.add(
    ICONS[icon.iconName] = icon.definition,
  );
});

// solid
[
  'Bars',
  'Ghost',
  'QuestionCircle',
  'AngleDown',
  'TimesCircle',
  'Spinner',
  'ExclamationCircle',
  'Clock',
  'Th',
  'Comments',
  'InfoCircle',
  'Eye',
  'Times',
  'CaretLeft',
  'CaretRight',
  'Download',
  'ChevronLeft',

].forEach(name => {
  const icon = require(`@fortawesome/free-solid-svg-icons/fa${name}.js`);
  let iconName = icon.iconName;
  if (ICONS[iconName]) { iconName = `${iconName}-solid`; }
  library.add(
    ICONS[iconName] = icon.definition,
  );
});


export default ICONS;
