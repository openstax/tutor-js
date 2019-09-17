import { get, map, union, partial, reduce } from 'lodash';
import { makeSimpleStore } from './helpers';

// this appears to be built in some non-standard way that
// does not work with 'import'
const htmlparser = require('htmlparser2');

const LINKS_BEGIN = ['#'];
const LINKS_CONTAIN = ['cnx.org/contents/'];

const MEDIA_LINK_EXCLUDES = [
  '.nav',
  '.view-reference-guide',
  '[data-type=footnote-number]',
  '[data-type=footnote-ref]',
  '[data-targeted=media]',
  '[href*=\'/\']',
  '[href=\'#\']',
];

const buildAllowed = function(linksBegin, linksContain) {
  const beginSelectors = map(linksBegin, linkString => `a[href^='${linkString}']`);

  const containSelectors = map(linksContain, linkString => `a[href*='${linkString}']`);

  return union(beginSelectors, containSelectors);
};

const MediaConfig = {
  _local: {},

  loaded(id, mediaDOM) {
    this._local[id] = mediaDOM;
    return this.emit(`loaded.${id}`, mediaDOM);
  },

  _parseAndLoad(actions, dom, link) {
    if (link.attribs.href.search('#') === 0) {
      const id = link.attribs.href.replace('#', '');
      const idDOM = htmlparser.DomUtils.getElementById(id, dom);
      if (idDOM) {
        const outerEl = get(idDOM, 'parent.attribs.class') === 'os-figure' ? idDOM.parent : idDOM;
        const mediaDOM = {
          name: idDOM.name,
          html: htmlparser.DomUtils.getOuterHTML(outerEl),
        };

        actions.loaded(id, mediaDOM);
      }
    }
  },

  _parseHandler(actions, error, dom) {
    const links = htmlparser.DomUtils.getElementsByTagName('a', dom);
    return links.forEach(link => actions._parseAndLoad(actions, dom, link));
  },

  parse(htmlString) {
    if (this.parseHandler == null) { this.parseHandler = new htmlparser.DomHandler(partial(this._parseHandler, this)); }
    if (this.parser == null) { this.parser = new htmlparser.Parser(this.parseHandler); }
    return this.parser.parseComplete(htmlString);
  },

  _get(id) {
    return this._local[id];
  },

  reset() {
    this._local = {};
    delete this.parseHandler;
    return delete this.parser;
  },

  exports: {
    get(id) { return this._get(id); },
    isLoaded(id) { return (this._get(id) != null); },

    getMediaIds() {
      return Object.keys(this._local);
    },

    getLinksContained() {
      return LINKS_CONTAIN;
    },

    getAllowed() {
      return buildAllowed(LINKS_BEGIN, LINKS_CONTAIN);
    },

    getExcluded() {
      return MEDIA_LINK_EXCLUDES;
    },

    getSelector() {
      const notMedias = reduce(MEDIA_LINK_EXCLUDES, (current, exclude) => `${current}:not(${exclude})`
        , '');

      return map(buildAllowed(LINKS_BEGIN, LINKS_CONTAIN), allowed => `${allowed}${notMedias}`).join(', ');
    },
  },
};


const { actions, store } = makeSimpleStore(MediaConfig);
export { actions as MediaActions, store as MediaStore };
