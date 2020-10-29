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
    Cypress.log({ message: `with ${size} screen size (${w}, ${h})` })
    cy.viewport(w, h)
    tests(size, SCREENS[size])
  })
};
