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
    red:           'red',
    warning:       '#f4d019', // yellow
    danger:        '#c2002f', // dark red
    teal:          '#0C9372',
    highlight:     '#d2f7fc', // light blue
    bright_green:  '#61b22a',
    bright_blue:   '#0dc0dc',
    cerulan:       '#007297',
    dark_blue:     '#002469',
    green:         '#77af42',
    strong_red:    '#c22032',
    soft_red:      '#e298a0',
    gray_red:      '#f8e8ea',
    orange:        '#df571e',
};

const tasks = {
    reading:  colorDefinitions.quaternary,
    external: '#edf2ff',
    homework: '#00c1de',
    event:    colorDefinitions.secondary,
    failure:  colorDefinitions.danger,
};
tasks.practice_worst_topics = tasks.page_practice = tasks.practice_saved = tasks.homework;

export const colors = {
    ...colorDefinitions,
    neutral,
    tasks,
    line: neutral.thin,
    paleLine: neutral.pale,
    disabledInputBorder: '#c1c1c1',

    pointsScoredStatus: {
        partial: '#f4e9c7',
        incorrect: '#f8e8ea',
        correct: '#dbe8ce',
    },

    states: {
        active:   neutral.dark,
        disabled: neutral.std,
        disabled_light: '#c1c1c1',
        correct: '#009c10',
        trouble: '#fbe7ea',
        border_trouble: '#f4c0c5',
    },

    controls: {
        selected: colorDefinitions.secondary,
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
            border: colorDefinitions.secondary,
        },
        neutral: {
            background: neutral.pale,
            border: neutral.dark,
        },
        addEditQuestion: {
            background: '#dff2f7',
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
                    background: colorDefinitions.secondary,
                    foreground: '#FFFFFF',
                    border: '#4B8315',
                },
            },
        },
    },
};
colors.templates.practice_worst_topics = colors.templates.page_practice = colors.templates.practice_saved = colors.templates.homework;

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
    readingSubnav: {
        height: '88px',
    },
};

const BREAKPOINTS = {
    mobile: 600,
    tablet: 999,
    desktop: 1000,
    large: 1600,
};

export { BREAKPOINTS };

export const breakpoint = {
    mobile(...args) {
        return css`@media(max-width: ${BREAKPOINTS.mobile}px) { ${css(...args)} }`;
    },
    tablet(...args) {
        return css`@media(max-width: ${BREAKPOINTS.tablet}px) { ${css(...args)} }`;
    },
    desktop(...args) {
        return css`@media(min-width: ${BREAKPOINTS.desktop}px) { ${css(...args)} }`;
    },
    large(...args) {
        return css`@media(min-width: ${BREAKPOINTS.large}px) { ${css(...args)} }`;
    },
    // Keep the reading task arrow pagination to the 1200px breakpoint
    reading_pagination(...args) {
        return css`@media(min-width: 1200px) { ${css(...args)} }`;
    },
    only: {
        mobile(...args) {
            return css`@media(max-width: ${BREAKPOINTS.mobile}px) { ${css(...args)} }`;
        },
        tablet(...args) {
            return css`@media(min-width: ${BREAKPOINTS.mobile+1}px) and (max-width: ${BREAKPOINTS.tablet}px) { ${css(...args)} }`;
        },
        desktop(...args) {
            return css`@media(min-width: ${BREAKPOINTS.desktop}px) and (max-width: ${BREAKPOINTS.large-1}px) { ${css(...args)} }`;
        },
        large(...args) {
            return css`@media(min-width: ${BREAKPOINTS.large}px) { ${css(...args)} }`;
        },
    },
    margins: {
        mobile: '8px',
        tablet: '24px',
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
    breakpoint,
    sizes: {
        bookTocWidth: '300px',
    },

    borders: {
        box: `1px solid ${neutral.lighter}`,
    },

    zIndex: {
        navbar: 1030,
        footer: 5,
        goToTop: 1031,
        modal: 1050,
        sidePanel: 1029,
    },
};

export default TutorTheme;
