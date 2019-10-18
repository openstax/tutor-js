import { css } from 'styled-components';

// Shared with scss in styles/variables

const neutral = {
  lightest: '#f9f9f9', // nearly white
  bright:   '#f5f5f5', // bright gray
  cool:     '#f6f7f8', // cool gray
  lighter:  '#f1f1f1', // light gray
  light:    '#e4e4e4', // light gray
  lite:     '#929292', // a gray that's darker than "light"
  std:      '#818181', // gray
  thin:     '#6f6f6f',
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
  black:         'black',
  white:         'white',
  warning:       '#f4d019', // yellow
  danger:        '#c2002f', // dark red
  teal:          '#0C9372',
};

const tasks = {
  reading:  colorDefinitions.quaternary,
  homework: '#00c1de',
  external: '#d3d6e0',
  event:    colorDefinitions.secondary,
  failure:  colorDefinitions.danger,
};

const TutorTheme = {

  colors: {
    ...colorDefinitions,
    neutral,
    tasks,
    states: {
      active:   neutral.dark,
      disabled: neutral.std,
      correct:  '#009c10',
    },

    controls: {
      selected: '#63a524',
      active:   '#337eb5',
      muted:    neutral.lite,
      notice:   '#eba927',
    },

  },

  navbars: {
    top: {
      height: '60px',
    },
    bottom: {
      height: '50px',
    },
  },

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

  fonts: {
    sans(size, lineHeight) {
      return css`
        font-family: 'Lato', Helvetica, sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: ${size};
        line-height: ${lineHeight || size};
      `;
    },
  },
};

export default TutorTheme;
