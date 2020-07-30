import { last, filter } from 'lodash';
import moment from 'moment';
import axios from 'axios';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


const expectTimeDuration = (expected, duration) => {
  return actual => {
    expect(
      Math.round(
        moment.duration(actual).as(duration) * 100
      ) / 100,
    ).to.be.below(expected, `loading time in ${duration}`);
  };
};


Cypress.Commands.add('setRole', (role) => cy.request({ url: `http://localhost:8111/api/setrole?role=${role}` }))

Cypress.Commands.add('getTestElement', (id, selector = '') => cy.get(`[data-test-id="${id}"]${selector}`));

Cypress.Commands.add('dismissTour', () => {
  cy.getTestElement('value-prop').find('button').click();
});

Cypress.Commands.add('dismissLinksPrompt', () => {
  cy.getTestElement('tour-step').find('button').last().click();
  cy.getTestElement('tour-step').find('[data-test-id="primary-button"]').click();
});

Cypress.Commands.add('disableTours', () => {
  cy.window().then(w => w._MODELS.feature_flags.set('tours', false));
});

Cypress.Commands.add('navigationTime', (type = 'domComplete') => {
  return cy.window().then((win) => {
    return last(win.performance.getEntriesByType('navigation'))[type];
  });
});

Cypress.Commands.add('checkLastPageLoadTime', (value, duration) => {
  Cypress.log({ name: 'pageLoadTime', message: `less than ${value} ${duration}` });
  cy.navigationTime('domComplete').should(expectTimeDuration(value, duration));
});

Cypress.Commands.add('lastRequestStats', (url, property = 'duration') => {
  return cy.window().then((win) => {
    const stats = filter(win.performance.getEntriesByType('resource'), (perf) => perf.name.match(url));
    expect(stats).not.to.be.empty;
    return last(stats)[property];
  });
});

Cypress.Commands.add('checkLastRequestTime', (url, value, duration) => {
  Cypress.log({ name: 'xhrLoadTime', message: `less than ${value} ${duration}` });
  cy.lastRequestStats(url, 'duration').should(expectTimeDuration(value, duration));
});

Cypress.Commands.add('loginAccount', (login=Cypress.env('USER_LOGIN'), password=Cypress.env('USER_PASSWORD')) => {
  cy.visit('/dashboard');
  cy.get('body').then((body) => {
    if (body.find('.development-login').length) {
      cy.get('#search_query').type(login);
      cy.wait(500);
      cy.get('#search-results-list a').first().click();
    } else if (body.find('#login-signup-form').length) {
      cy.get('input[name="login_form[email]"]').type(login);
      cy.get('input[name="login_form[password]"]').type(password);
      cy.get('input[type="submit').click();
    }
  });
});

Cypress.Commands.add('selectOrCreateCourse', (subject) => {
  cy.get('body').then((body) => {

    const currentCourseLinks = body.find(`.my-courses-current .course-teacher [data-appearance="${subject}"] a`);
    if (currentCourseLinks.length) {
      cy.wrap(currentCourseLinks[0]).click();
    } else {
      cy.get('.my-courses-add-zone a').click();

      // course subject
      cy.get(`.list-group-item[data-appearance="${subject}"]`).first().click();
      cy.get('.btn-primary').click();

      // term
      cy.get('.list-group-item').first().click();
      cy.get('.btn-primary').contains('Continue').click();

      // accept default name
      cy.get('.btn-primary').contains('Continue').click();

      // info about course
      cy.get('input#number-students').type(1);
      cy.get('.btn-primary').contains('Continue').click();
    }
  });
});

const logToPagerDuty = (options) => axios({
  method: 'POST',
  url: 'https://events.pagerduty.com/v2/enqueue',
  data: {
    routing_key: Cypress.env('PAGERDUTY_TOKEN'),
    event_action: 'trigger',
    payload: Object.assign({
      source: 'tutor-local',
      severity: 'warning',
    }, options),
  },
});


if (Cypress.env('PAGERDUTY_TOKEN')) {
  Cypress.Commands.add('logToPagerDuty', (options = {}) => {
    logToPagerDuty(options);
  });

  Cypress.on('fail', (err, test) => {
    const summary = `${test.parent.title} ${test.title} failed: ${err.message}`;
    logToPagerDuty({
      summary,
      dedup_key: test.title,
    });
    return true;
  });
}
