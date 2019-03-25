import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import dom from '../helpers/dom';

import MediaPreview from './media-preview';
import { TaskStepStore } from '../flux/task-step';
import { MediaStore } from '../flux/media';
import Courses from '../models/courses-map';

import ScrollToLinkMixin from './scroll-to-link-mixin';

import Router from '../helpers/router';


const LinkContentMixin = {

  componentDidUpdate() {
  },

  componentWillUnmount() {
  },


};

const ReadingContentMixin = {
  mixins: [ ScrollToLinkMixin ],

  componentDidMount() {
  },

  componentDidUpdate() {
  },

  componentWillUnmount() {
  },


};



const BookContentMixin = _.extend({}, LinkContentMixin, ReadingContentMixin);

export { BookContentMixin, LinkContentMixin, ReadingContentMixin };

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
