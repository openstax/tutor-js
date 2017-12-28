/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import S from '../helpers/string';
import dom from '../helpers/dom';

import { MediaPreview } from './media-preview';
import { TaskStepStore } from '../flux/task-step';
import { MediaStore } from '../flux/media';
import Courses from '../models/courses-map';

import ScrollToLinkMixin from './scroll-to-link-mixin';

import Router from '../helpers/router';

// According to the tagging legend exercises with a link should have `a.os-embed`
// but in the content they are just a vanilla link.
const EXERCISE_LINK_SELECTOR = [
  '.os-exercise > [data-type="problem"] > p > a[href]',
  '.ost-exercise > [data-type="problem"] > p > a[href]'
].join(', ');

const LEARNING_OBJECTIVE_SELECTORS = '.learning-objectives, [data-type=abstract]';
const IS_INTRO_SELECTORS = '.splash img, [data-type="cnx.flag.introduction"]';

const LinkContentMixin = {
  componentDidMount() {
    this._linkContentIsMounted = true;
    return (
        this.processLinks()
    );
  },

  componentDidUpdate() {
    return (
        this.processLinks()
    );
  },

  componentWillUnmount() {
    this._linkContentIsMounted = false;
    return (
        this.cleanUpLinks()
    );
  },

  getCnxIdOfHref(href) {
    const beforeHash = _.first(href.split('#'));
    return (
        _.last(beforeHash.split('/'))
    );
  },

  buildReferenceBookLink(cnxId) {
    let referenceBookLink;
    let {courseId, ecosystemId} = Router.currentParams();
    const {query, id} = this.props;

    if (ecosystemId && !courseId) {
      courseId = __guard__(_.findWhere(Courses.array, {ecosystem_id: ecosystemId}), x => x.id);
    }

    // suboptimal but is the best we can as long as the reference book depends on having a courseId in url
    if (!courseId) { return null; }

    if (id != null) {
      const related_content = __guard__(TaskStepStore.get(id), x1 => x1.related_content);

      if (related_content != null) {
        const section = typeof this.sectionFormat === 'function' ? this.sectionFormat((related_content[0] != null ? related_content[0].chapter_section : undefined) || (related_content[0] != null ? related_content[0].book_location : undefined)) : undefined;
        if (section != null) { referenceBookLink = Router.makePathname('viewReferenceBookSection', {courseId, section}, query); }
      }
    } else if (cnxId != null) {
      referenceBookLink = Router.makePathname( 'viewReferenceBookPage', { courseId, cnxId });
    }

    return (

        referenceBookLink

    );
  },

  isMediaLink(link) {
    // TODO it's likely that this is no longer needed since the links being
    // passed into this are now much stricter and exclude where `href="#"` and
    // where `href` contains any `/`
    return (
        ((link.hash.length > 0) || (link.href !== link.getAttribute('href'))) && (link.hash.search('/') === -1)
    );
  },

  hasCNXId(link) {
    const trueHref = link.getAttribute('href');
    return (
        (link.hash.length > 0) && (trueHref.substr(0, 1) !== '#')
    );
  },

  getMedia(mediaId) {
    const root = ReactDOM.findDOMNode(this);
    try {
      return (
          root.querySelector(`#${mediaId}`)
      );
    } catch (error) {
      // silently handle error in case selector is
      // still invalid.
      console.warn(error);
      return (
          false
      );
    }
  },

  cleanUpLinks() {
    const root = ReactDOM.findDOMNode(this);
    const previewNodes = root.getElementsByClassName('media-preview-wrapper');

    return (

        _.each(previewNodes, previewNode => ReactDOM.unmountComponentAtNode(previewNode))

    );
  },

  linkPreview(link) {
    let mediaDOM;
    const mediaId = link.hash.replace('#', '');
    if (mediaId) { mediaDOM = this.getMedia(mediaId); }

    // no need to set up media preview if
    // media id is invalid.
    if (mediaDOM === false) { return link; }

    const mediaCNXId = this.getCnxIdOfHref(link.getAttribute('href')) || this.props.cnxId || (typeof this.getCnxId === 'function' ? this.getCnxId() : undefined);
    const previewNode = document.createElement('span');
    previewNode.classList.add('media-preview-wrapper');
    if (link.parentNode != null) {
      link.parentNode.replaceChild(previewNode, link);
    }

    const mediaProps = {
      mediaId,
      cnxId: mediaCNXId,
      bookHref: this.buildReferenceBookLink(mediaCNXId),
      mediaDOMOnParent: mediaDOM,
      shouldLinkOut: (typeof this.shouldOpenNewTab === 'function' ? this.shouldOpenNewTab() : undefined),
      originalHref: link.getAttribute('href')
    };

    const mediaPreview = <MediaPreview {...mediaProps}>
      {link.innerText}
    </MediaPreview>;

    ReactDOM.render(mediaPreview, previewNode);
    return (
        null
    );
  },

  processLink(link) {
    if (this.isMediaLink(link)) {
      return (
          this.linkPreview(link)
      );
    } else {
      return (
          link
      );
    }
  },

  processLinks() {
    return (
        _.defer(this._processLinks)
    );
  },

  _processLinks() {
    if (!this._linkContentIsMounted) { return; }
    const root = ReactDOM.findDOMNode(this);
    const mediaLinks = root.querySelectorAll(MediaStore.getSelector());
    const exerciseLinks = root.querySelectorAll(EXERCISE_LINK_SELECTOR);

    const otherLinks = _.chain(mediaLinks)
      .map(this.processLink)
      .compact()
      .uniq()
      .value();

    if (otherLinks != null ? otherLinks.length : undefined) { if (typeof this.renderOtherLinks === 'function') {
      this.renderOtherLinks(otherLinks);
    } }
    if (exerciseLinks != null ? exerciseLinks.length : undefined) { return (typeof this.renderExercises === 'function' ? this.renderExercises(exerciseLinks) : undefined); }
  }
};

const ReadingContentMixin = {

  mixins: [ ScrollToLinkMixin ],

  componentDidMount() {
    this._linkContentIsMounted = true;
    this.insertCanonicalLink();
    this.insertOverlays();
    this.detectImgAspectRatio();
    this.cleanUpAbstracts();
    return (
        this.processLinks()
    );
  },

  componentDidUpdate() {
    this.updateCanonicalLink();
    this.insertOverlays();
    this.detectImgAspectRatio();
    this.cleanUpAbstracts();
    return (
        this.processLinks()
    );
  },

  componentWillUnmount() {
    return (
        this.removeCanonicalLink()
    );
  },

  insertCanonicalLink() {
    this.linkNode = document.createElement('link');
    this.linkNode.rel = 'canonical';
    document.head.appendChild(this.linkNode);

    return (

        this.updateCanonicalLink()

    );
  },

  updateCanonicalLink() {
    const cnxId = this.props.cnxId || (typeof this.getCnxId === 'function' ? this.getCnxId() : undefined) || '';
    // leave versioning out of canonical link
    const canonicalCNXId = _.first(cnxId.split('@'));
    const {courseId} = Router.currentParams();
    const {webview_url} = Courses.get(courseId);
    const baseWebviewUrl = _.first(webview_url.split('/contents/'));

    // webview actually links to webview_url as it's canonical url.
    // will need to ask them why.
    return (
        this.linkNode.href = `${baseWebviewUrl}/contents/${canonicalCNXId}`
    );
  },

  removeCanonicalLink() {
    // document.head.
    return (
        this.linkNode.remove()
    );
  },

  insertOverlays() {
    const title = this.getSplashTitle();
    if (!title) { return; }
    const root = ReactDOM.findDOMNode(this);
    return (
        (() => {
          const result = []
    );
      for (let img of Array.from(root.querySelectorAll('.splash img'))) {
        if (img.parentElement.querySelector('.ui-overlay')) { continue; }
        const overlay = document.createElement('div');
        // don't apply overlay twice or if cnx content already includes it
        if (img.parentElement.querySelector('.tutor-ui-overlay')) { continue; }
        // Prefix the class to distinguish it from a class in the original HTML content
        overlay.className = 'tutor-ui-overlay';
        overlay.innerHTML = title;
        result.push(img.parentElement.appendChild(overlay));
      }
      return (
          result
      );
    })();
  },

  cleanUpAbstracts() {
    const root = ReactDOM.findDOMNode(this);
    const abstract = root.querySelector(LEARNING_OBJECTIVE_SELECTORS);
    // dont clean up if abstract does not exist or if it has already been cleaned up
    if ((abstract == null) || (abstract.dataset.isIntro != null)) { return; }

    for (let abstractChild of Array.from(abstract.childNodes)) {
      // leave the list alone -- this is the main content
      if ((abstractChild == null) || (abstractChild.tagName === 'UL')) { continue; }

      const text = (abstractChild.textContent || '').trim();

      // grab text if relevant and set as preamble
      if (((abstractChild.dataset != null ? abstractChild.dataset.type : undefined) !== 'title') && text) {
        abstract.dataset.preamble = text;
      }

      // remove all non-lists children to prevent extra text in preamble
      if (typeof abstractChild.remove === 'function') {
        abstractChild.remove();
      }
    }

    return (

        abstract.dataset.isIntro = (root.querySelector(IS_INTRO_SELECTORS) != null)

    );
  },

  detectImgAspectRatio() {
    const root = ReactDOM.findDOMNode(this);
    return (
        Array.from(root.querySelectorAll('img')).map((img) =>
          img.complete ?
            sizeImage.call(img)
          :
            (img.onload = sizeImage))
    );
  }
};


// called with the context set to the image
var sizeImage = function() {
  const figure = dom.closest(this, 'figure');
  if (!figure) { return; }

  const aspectRatio = this.naturalWidth / this.naturalHeight;

  // let wide, square, and almost square figures be natural.
  if ((aspectRatio > 0.9) || ((figure.parentNode != null ? figure.parentNode.dataset.orient : undefined) === 'horizontal')) {
    figure.classList.add('tutor-ui-horizontal-img');
    if ((this.naturalWidth > 450) && ((figure.parentNode != null ? figure.parentNode.nodeName : undefined) !== 'FIGURE')) {
      return (
          figure.classList.add('full-width')
      );
    }
  } else {
    return (
        figure.classList.add('tutor-ui-vertical-img')
    );
  }
};


const BookContentMixin = _.extend({}, LinkContentMixin, ReadingContentMixin);

export default {BookContentMixin, LinkContentMixin, ReadingContentMixin};

function __guard__(value, transform) {
  return (
      (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
  );
}
