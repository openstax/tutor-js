import _ from 'underscore';
import unescape from 'lodash/unescape';
import htmlparser from 'htmlparser2';
import { makeSimpleStore } from './helpers';
import { StepHelpsHelper } from 'shared';

const TEXT_LENGTH_CHECK = 110;
const TEXT_LENGTH = 125;
const TEXT_CHECK_RANGE = TEXT_LENGTH - TEXT_LENGTH_CHECK;
const {
  PERSONALIZED_GROUP,
  INDIVIDUAL_REVIEW,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  INTRO_ALIASES,
  TITLES,
} = StepHelpsHelper;

const isLearningObjectives = element =>
  ((__guard__(element != null ? element.attribs : undefined, x => x['class']) != null) &&
    (element.attribs['class'].search(/learning-objectives/) > -1)) ||
    (element.attribs['data-type'] === 'abstract')
;

const isTypedClass = element =>
  (__guard__(element != null ? element.attribs : undefined, x => x['class']) != null) &&
    (element.attribs['class'].search(/learning-objectives|references|ap-connection|solution/) > -1)
;

const isTipsForSuccess = element => (__guard__(element != null ? element.attribs : undefined, x => x['class']) != null) && (element.attribs['class'].search(/tips-for-success/) > -1);

const isCaption = element => element.name === 'caption';

const isNote = function(element) {
  if ((__guard__(element != null ? element.attribs : undefined, x => x['class']) == null) && (element.attribs['data-element-type'] == null)) { return; }

  const classes = element.attribs['class'].split(' ');
  return !_.isEmpty(_.intersection(classes, ['note', 'example', 'grasp-check'])) ||
    (element.attribs['data-element-type'] === 'check-understanding');
};

const isTyped = element => __guard__(element != null ? element.attribs : undefined, x => x['data-element-type']) != null;

const isLabel = element =>
  (element.attribs['data-has-label'] === 'true') &&
    !isTipsForSuccess(element)
;

const isTitle = element =>
  (element.attribs['data-type'] === 'title') &&
    !isTyped(element.parent) &&
    !isTypedClass(element.parent) &&
    !isCaption(element.parent)
;

const isDocumentTitle = element => element.attribs['data-type'] === 'document-title';

const grabLabel = element => __guardMethod__(element.attribs['data-label'], 'trim', o => o.trim());
const grabTitle = element => __guardMethod__(__guard__(element.children != null ? element.children[0] : undefined, x => x.data), 'trim', o => o.trim());

const isMaths = element => (element.attribs != null ? element.attribs['data-math'] : undefined) != null;

const grabTruncatedText = function(text, start = TEXT_LENGTH_CHECK, range = TEXT_CHECK_RANGE) {
  const end = start + range;
  if (text.length >= end) {
    const textEnd = start + text.substring(start, end).indexOf(' ');
    text = `${text.substring(0, textEnd)}...`;
  }
  return text;
};

const keepMathsOnly = function(element) {
  if (isMaths(element)) {
    return element;
  } else {
    return htmlparser.DomUtils.getText(element);
  }
};

const getLengthFromTextOrMaths = element => __guard__(htmlparser.DomUtils.getText(element), x => x.length) || 0;

const StepTitleConfig = {
  _local: {},
  _meta: {},

  loaded(id, title) {
    this._local[id] = title;
    return this.emit(`loaded.${id}`, title);
  },

  loadedMetaData(contentId, metaData = {}) {
    metaData = _.extend({
      hasLearningObjectives: false,
    }, metaData);

    return this._meta[contentId] = metaData;
  },

  _parseMeta(actions, contentId, error, dom) {
    const learningObjectives = htmlparser.DomUtils.findOne(isLearningObjectives, dom, false);
    const meta =
      { hasLearningObjectives: (learningObjectives != null) };

    return actions.loadedMetaData(contentId, meta);
  },

  _parseReading(actions, id, error, dom) {
    let text;
    const title = htmlparser.DomUtils.findOne(isTitle, dom, false);
    const meta = actions._parseMeta(actions, id, error, dom);

    if (title != null) {
      text = grabTitle(title);
    } else {
      const label = htmlparser.DomUtils.findOne(isLabel, dom, false);
      if (label != null) { text = grabLabel(label); }
    }

    return actions.loaded(id, unescape(text));
  },

  _parseExercise(actions, id, error, dom) {
    let text = grabTruncatedText(htmlparser.DomUtils.getText(dom));

    const maths = htmlparser.DomUtils.findOne(isMaths, dom, false);

    if (maths == null) {
      text = grabTruncatedText(htmlparser.DomUtils.getText(dom));
    } else {
      const simpleExercise = htmlparser.DomUtils.find(keepMathsOnly, dom, false);
      let exerciseLength = 0;

      const truncatedExercise = _.filter(simpleExercise, function(part) {
        if (exerciseLength > TEXT_LENGTH) { return false; }
        exerciseLength += getLengthFromTextOrMaths(part);
        return true;
      });

      if (exerciseLength >= TEXT_LENGTH) {
        const lastPart = _.last(truncatedExercise);

        if (lastPart.type === 'text') {
          let start;
          if (truncatedExercise.length > 1) { start = Math.max(exerciseLength - TEXT_LENGTH, 0); }
          lastPart.data = grabTruncatedText(lastPart.data, start);
          truncatedExercise[truncatedExercise.length - 1] = lastPart;
        } else {
          truncatedExercise.push({ data: '…', type: 'text' });
        }
      }

      text = htmlparser.DomUtils.getText(truncatedExercise);
      if (text.length >= TEXT_LENGTH) { text = `${text.slice(0, TEXT_LENGTH - 1)}…`; }
    }

    actions.loaded(id, text);
    return actions.loadedMetaData(id);
  },

  parseReading(id, htmlString) {
    if (this._get(id) == null) {
      const parseHandler = new htmlparser.DomHandler(_.partial(this._parseReading, this, id));
      const titleParser = new htmlparser.Parser(parseHandler);
      return titleParser.parseComplete(htmlString);
    }
  },

  parseExercise(id, htmlString) {
    if (this._get(id) == null) {
      const parseHandler = new htmlparser.DomHandler(_.partial(this._parseExercise, this, id));
      const titleParser = new htmlparser.Parser(parseHandler);
      return titleParser.parseComplete(htmlString);
    }
  },

  parseStep(step) {
    if (step.type === 'exercise') {
      return this.parseExercise(step.id, _.first(step.content.questions).stem_html);
    } else {
      return this.parseReading(step.id, step.content_html);
    }
  },

  parseSteps(steps) {
    return _.each(steps, this.parseStep, this);
  },

  parseMetaOnly(contentId, htmlString) {
    if (this._meta[contentId] == null) {
      const parseHandler = new htmlparser.DomHandler(_.partial(this._parseMeta, this, contentId));
      const metaParser = new htmlparser.Parser(parseHandler);
      return metaParser.parseComplete(htmlString);
    }
  },

  _get(id) {
    return this._local[id];
  },

  reset() {
    this._local = {};
    return this._meta = {};
  },

  exports: {
    get(id) { return this._get(id); },
    isLoaded(id) { return (this._get(id) != null); },
    hasLearningObjectives(contentId) { return (this._meta[contentId] != null ? this._meta[contentId].hasLearningObjectives : undefined); },

    getTitleForCrumb(crumb) {
      let title;
      if (!crumb) { return ''; }
      if (crumb.id && store.get(crumb.id)) {
        return store.get(crumb.id);
      }
      if ((crumb.type === 'reading') && (__guard__(crumb.related_content != null ? crumb.related_content[0] : undefined, x => x.title) != null)) {
        const relatedTitle = crumb.related_content[0].title;

        if (title === 'Summary') {
          return title = `${title} of ${relatedTitle}`;
        } else if (!title) {
          return title = relatedTitle;
        }
      } else {
        switch (crumb.type) {
        case 'end':
          return `${crumb.task.title} Completed`;
        case 'coach':
          return TITLES[SPACED_PRACTICE_GROUP];
        case INTRO_ALIASES[SPACED_PRACTICE_GROUP]:
          return TITLES[SPACED_PRACTICE_GROUP];
        case INTRO_ALIASES[PERSONALIZED_GROUP]:
          return TITLES[PERSONALIZED_GROUP];
        case INTRO_ALIASES[TWO_STEP_ALIAS]:
          return TITLES[TWO_STEP_ALIAS];
        case INTRO_ALIASES[INDIVIDUAL_REVIEW]:
          return TITLES[INDIVIDUAL_REVIEW];
        }
      }
    },
  },
};

var { actions, store } = makeSimpleStore(StepTitleConfig);
export { actions as StepTitleActions, store as StepTitleStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}