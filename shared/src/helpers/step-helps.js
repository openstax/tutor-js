import React from 'react';
import _ from 'underscore';
import capitalize from 'lodash/capitalize';

const REVIEW_LABEL = 'review';
const PERSONALIZED_GROUP = 'personalized';
const SPACED_PRACTICE_GROUP = 'spaced practice';
const TWO_STEP_ALIAS = 'two-step';
const INDIVIDUAL_REVIEW = 'individual-review';

const PROJECT_NAME = {
  tutor: 'OpenStax Tutor',
  'concept-coach': 'OpenStax Concept Coach',
};

const PROJECT = {
  'concept-coach': {
    name: 'Concept Coach',
    feedbackType: 'immediate feedback',
  },

  'tutor': {
    name: 'Tutor',
    feedbackType: 'personalized feedback',
  },
};

const LABELS = {};
LABELS[PERSONALIZED_GROUP] = 'Personalized';
LABELS[SPACED_PRACTICE_GROUP] = 'Spaced Practice';
LABELS[TWO_STEP_ALIAS] = 'Two-step';
LABELS[INDIVIDUAL_REVIEW] = 'Your individual review';
const TITLES = {};
TITLES[PERSONALIZED_GROUP] = `${LABELS[PERSONALIZED_GROUP]} questions`;
TITLES[SPACED_PRACTICE_GROUP] = LABELS[SPACED_PRACTICE_GROUP];
TITLES[TWO_STEP_ALIAS] = `${LABELS[TWO_STEP_ALIAS]} questions`;
TITLES[INDIVIDUAL_REVIEW] = 'Your individual review';

const ALIASES = {};
ALIASES[INDIVIDUAL_REVIEW] = INDIVIDUAL_REVIEW;
ALIASES[PERSONALIZED_GROUP] = PERSONALIZED_GROUP;
ALIASES[SPACED_PRACTICE_GROUP] = 'spaced-practice';
ALIASES[TWO_STEP_ALIAS] = TWO_STEP_ALIAS;

const makeAliases = suffix => _.mapObject(ALIASES, alias => `${alias}-${suffix}`);

const INTRO_ALIASES = makeAliases('intro');

const getProject = (project = 'tutor') => PROJECT[project];

const getIntroText = {};

getIntroText[PERSONALIZED_GROUP] = function(project, locate = true) {
  const locationText = locate ? '—like this next one—' : ' ';

  return (
    <p>
      {'\
    Personalized questions'}
      {locationText}
      {`are chosen specifically
    for you by `}
      {getProject(project).name}
      {' based on your learning history.\
    '}
    </p>
  );
};

getIntroText[SPACED_PRACTICE_GROUP] = function(project, locate = true) {
  const locationText = locate ? '—like this next one—' : ' ';

  return [
    <p key="did-you-know">
      {`\
  Did you know?  Research shows you can strengthen your
  memory—`}
      <strong>
        and spend less time studying
      </strong>
      {`—if
  you revisit material over multiple study sessions.\
  `}
    </p>,
    <p key="sp-desc">
      {getProject(project).name}
      {' will include '}
      <strong>
        spaced practice
      </strong>
      {' questions\
  '}
      {locationText}
      {`from prior sections to give your learning a boost.
  You may occasionally see questions you\'ve seen before.\
  `}
    </p>,
  ];
};

getIntroText[TWO_STEP_ALIAS] = project => [
  <p key="research">
    {'\
Research shows a great way to boost learning is to try recalling what you have learned.'}
  </p>,
  <h4 key="step-1">
    Step 1: Free response for longer lasting learning
  </h4>,
  <p key="help-learn">
    {`\
Help your learning last longer by constructing an answer in the free response box from memory.
For greatest benefit, try not to refer to notes or text.\
`}
  </p>,
  <h4 key="step-2">
    {'Step 2: '}
    {capitalize(getProject(project).feedbackType)}
    {' with multiple choice'}
  </h4>,
  <p key="select-best">
    {'\
Receive '}
    {getProject(project).feedbackType}
    {' by selecting the best multiple-choice option.\
'}
  </p>,
  <p key="can-review">
    {'\
Both you and your instructor can review your answers later.\
'}
  </p>,
]
;


getIntroText[INDIVIDUAL_REVIEW] = project =>
  <p>
    {`\
  OpenStax Tutor has selected questions for you based on what you’ve studied and how you’ve
  performed so far. By answering these custom review questions, you’re more likely to
  remember what you learned.\
  `}
  </p>
;


const getHelpText = _.mapObject(getIntroText, getIntro => _.partial(getIntro, _, false));

getHelpText[TWO_STEP_ALIAS] = project => [
  <p key="why">
    <strong>
      Why do you ask me to answer twice?
    </strong>
  </p>,
  <p key="research-shows">
    {`Research shows that recalling the answer to a question from memory
helps your learning last longer.  So, `}
    {getProject(project).name}
    {` asks
for your own answer first, then gives multiple-choice options
so you can get `}
    {getProject(project).feedbackType}
    {`.  Both you and your
instructor can review your work later.`}
  </p>,
]
;


getHelpText[SPACED_PRACTICE_GROUP] = project => [
  <p key="what-is-sp">
    <strong>
      What is spaced practice?
    </strong>
  </p>,
  getIntroText[SPACED_PRACTICE_GROUP](project, false),
]
;

const getHelpInfo = function(group) {
  if (!_.contains(_.keys(ALIASES), group)) { return; }

  return {
    label: LABELS[group],
    title: TITLES[group],
    alias: ALIASES[group],
    introAlias: INTRO_ALIASES[group],
    getIntroText: getIntroText[group],
    getHelpText: getHelpText[group],
  };
};


export { REVIEW_LABEL, PERSONALIZED_GROUP, SPACED_PRACTICE_GROUP, TWO_STEP_ALIAS, INDIVIDUAL_REVIEW, LABELS, ALIASES, INTRO_ALIASES, TITLES, makeAliases, getHelpText, getIntroText, getHelpInfo };
