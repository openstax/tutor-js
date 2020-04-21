import { css } from 'styled-components';

// Shared with scss in styles/variables

const neutral = {
  lightest: '#fafafa', // nearly white
  bright:   '#f5f5f5', // bright gray
  cool:     '#f6f7f8', // cool gray
  lighter:  '#f1f1f1', // light gray
  light:    '#e4e4e4', // light gray
  pale:     '#d5d5d5',
  lite:     '#929292', // a gray that's darker than "light"
  std:      '#818181', // gray
  thin:     '#6f6f6f',
  grayblue: '#5e6062',
  gray:     '#5e5e5e',
  dark:     '#5f6163', // dark gray
  darker:   '#424242', // very dark gray
};

const colorDefinitions = {
  primary:       '#f47641', // orange
  secondary:     '#63a524', // green
  tertiary:      '#233066', // dark blue
  quaternary:    '#f4d019', // yellow
  blue_control:  '#337eb5',
  blue_info:     '#007da4',
  link:          '#027EB5',
  link_active:   '#128EC5',
  black:         'black',
  white:         'white',
  warning:       '#f4d019', // yellow
  danger:        '#c2002f', // dark red
  teal:          '#0C9372',
  highlight:     '#d2f7fc', // light blue
  bright_green:  '#61b22a',
  bright_blue:   '#0dc0dc',
};

const tasks = {
  reading:  colorDefinitions.quaternary,
  homework: '#00c1de',
  external: '#d3d6e0',
  event:    colorDefinitions.secondary,
  failure:  colorDefinitions.danger,
};

export const colors = {
  ...colorDefinitions,
  neutral,
  tasks,
  line: neutral.thin,
  paleLine: neutral.pale,

  states: {
    active:   neutral.dark,
    disabled: neutral.std,
    disabled_light: '#c1c1c1',
    correct: '#009c10',
    trouble: '#fbe7ea',
  },

  controls: {
    selected: '#63a524',
    active:   '#337eb5',
    muted:    neutral.lite,
    notice:   '#eba927',
  },

  navbars: {
    border: neutral.pale,
    divider: '#cdcdcd',
  },

  forms: {
    borders: {
      light: neutral.pale,
      focus: colorDefinitions.bright_blue,
      focusShadow: 'rgba(13,192,220,0.5)',
    },
  },

  templates: {
    reading: {
      background: '#fcf6d8',
      border: '#f4d018',
    },
    homework: {
      background: '#daf3f8',
      border: '#34bdd7',
    },
    external: {
      background: tasks.external,
      border: '#233066',
    },
    event: {
      background: '#63a52433',
      border: '#63a524',
    },
    neutral: {
      background: neutral.pale,
      border: neutral.dark,
    },
  },

  exercises: {
    selected: colorDefinitions.highlight,
    hovered:  'rgba(241, 241, 241, 0.4)',
  },

  assignments: {
    scores: {
      dropped:   colorDefinitions.bright_blue,
      extension: '#009670',
    },
    submissions: {
      background: neutral.lightest,
      correct: {
        background: '#ECF7D1',
        foreground: '#3B7800',
        inverse: {
          background: '#63A524',
          foreground: '#FFFFFF',
          border: '#4B8315',
        },
      },
    },
  },
};

export const fonts = {
  faces: {
    light() {
      return css`
        font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', Helvetica, sans-serif;
        font-weight: 300;
      `;
    },
  },
  sans(size, lineHeight) {
    return css`
      font-family: 'Lato', Helvetica, sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: ${size};
      line-height: ${lineHeight || size};
    `;
  },
};

export const navbars = {
  top: {
    height: '60px',
  },
  bottom: {
    height: '50px',
  },
};

export const breakpoints = {
  xsDown: '(max-width: 575.98px)',
  smDown: '(max-width: 767.98px)',
  mdDown: '(max-width: 991.98px)',
  lgDown: '(max-width: 1199.98px)',
  smUp: '(min-width: 576px)',
  mdUp: '(min-width: 768px)',
  lgUp: '(min-width: 992px)',
  xlUp: '(min-width: 1200px)',
};

const TutorTheme = {

  colors,
  fonts,
  navbars,

  sizes: {
    bookTocWidth: '300px',
  },

  borders: {
    box: `1px solid ${neutral.lighter}`,
  },

  zIndex: {
    navbar: 1030,
    footer: 5,
  },
};

export default TutorTheme;
