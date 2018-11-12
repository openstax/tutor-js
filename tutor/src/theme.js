// Shared with scss in styles/variables


const neutral = {
  lightest: '#f9f9f9', // nearly white
  bright:   '#f5f5f5', // bright gray
  cool:     '#f6f7f8', // cool gray
  lighter:  '#f1f1f1', // light gray
  light:    '#e4e4e4', // light gray
  lite:     '#999999', // a gray that's darker than "light"
  std:      '#818181', // gray
  thin:     '#6f6f6f',
  gray:     '#5e5e5e',
  dark:     '#5f6163', // dark gray
  darker:   '#424242', // very dark gray
};

const TutorTheme = {

  colors: {
    primary:       '#f47641', // orange
    secondary:     '#63a524', // green
    tertiary:      '#233066', // dark blue
    quaternary:    '#f4d019', // yellow
    blue_control:  '#337eb5', // 337eb5
    black:         'black',
    white:         'white',

    neutral,

    states: {
      correct: '#009c10',
    },

    controls: {
      active:  '#337eb5',
    },

  },


  borders: {
    box: `1px solid ${neutral.lighter}`,
  },

};

export default TutorTheme;
