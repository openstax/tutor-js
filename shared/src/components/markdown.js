import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import Markdown from 'markdown-it';

import ArbitraryHtmlAndMath from './html';

const md = new Markdown();

const MarkDown = ({ text, ...props }) => {
  const htmlProps = pick(props, 'block', 'className');

  const html = md.render(text);
  htmlProps.html = html;

  return <ArbitraryHtmlAndMath {...htmlProps} />;
};
MarkDown.propTypes = {
  text: PropTypes.string.isRequired,
};
export default MarkDown;
