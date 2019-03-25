import { findIndex, forEach } from 'lodash';
import { insert } from '../../helpers/immutable';
import UiSettings from 'shared/model/ui-settings';
import InfoStep from '../../models/student-tasks/info-step';

function insertBeforeMatch(type, steps, match) {
  const index = findIndex(steps, match);
  if (-1 !== index) {
    return insert(steps, index, new InfoStep({ type }));
  }
  return steps;
}

// spaced practice questions are preceded by a "Spaced Practice" card.
export function insertIndividiualReview({ steps, ...rest }) {
  return {
    ...rest,
    steps: insertBeforeMatch('individual-review-intro', steps, { isReview: true }),
  };
}

export function insertValueProp({ steps, ...rest }) {
  forEach({
    'personalized-intro':    { isPersonalized: true },
    'two-step-intro':        { isTwoStep: true },
    'spaced-practice-intro': { isSpacedPractice: true },
  }, (check, key) => {
    if (!UiSettings.get(`has-viewed-${key}`)) {
      steps = insertBeforeMatch(key, steps, check);
    }
  });
  return { steps, ...rest };
}
