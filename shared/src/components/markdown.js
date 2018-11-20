import React from 'react';
import _ from 'underscore';
import Markdown from 'markdown-it';

import ArbitraryHtmlAndMath from './html';

const md = new Markdown();

export default class extends React.Component {
  static displayName = 'Markdown';

  render() {
    const { text } = this.props;
    const htmlProps = _.pick(this.props, 'block', 'className');

    const html = md.render(text);
    htmlProps.html = html;

    return <ArbitraryHtmlAndMath {...htmlProps} />;
  }
}
