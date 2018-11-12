import { library } from '@fortawesome/fontawesome-svg-core';

const ICONS = {};


// regular
[
  'Square',
  'Calendar',
  'Comments',
  'CheckSquare',
].forEach(name => {
  const icon = require(`@fortawesome/free-regular-svg-icons/fa${name}.js`);
  library.add(
    ICONS[icon.iconName] = icon.definition,
  );
});

// solid
[
  'ArrowUp',
  'ArrowDown',
  'Bars',
  'Ghost',
  'CheckSquare',
  'QuestionCircle',
  'AngleDown',
  'TimesCircle',
  'Spinner',
  'ExclamationCircle',
  'Clock',
  'Times',
  'PaperPlane',
  'Th',
  'Comments',
  'InfoCircle',
  'Eye',
  'Times',
  'CaretLeft',
  'CaretRight',
  'Download',
  'ChevronRight',
  'ChevronUp',
  'ChevronDown',
  'ChevronLeft',
  'EyeSlash',
  'Eye',
  'Trash',
  'Video',
].forEach(name => {
  const icon = require(`@fortawesome/free-solid-svg-icons/fa${name}.js`);
  let iconName = icon.iconName;
  if (ICONS[iconName]) { iconName = `${iconName}-solid`; }
  library.add(
    ICONS[iconName] = icon.definition,
  );
});


export default ICONS;
