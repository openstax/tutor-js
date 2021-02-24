import { isNil } from 'lodash'
const SCREENS = {
    mobile: [375,667], // iphone
    tablet: [768,1024], // ipad
    desktop: [1280, 1024], // pretty much anything is larger than this
}

export const withScreenSizes = (sizes, tests) => {
    if (isNil(tests)) {
        tests = sizes;
        sizes = Object.keys(SCREENS)
    }
    sizes.forEach(size => {
        const [w,h] = SCREENS[size];
        cy.viewport(w, h)
        tests(size, SCREENS[size])
        cy.viewport(SCREENS.desktop[0], SCREENS.desktop[1])
    })
};
