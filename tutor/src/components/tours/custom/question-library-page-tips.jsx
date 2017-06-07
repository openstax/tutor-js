import React from 'react';

import TipsNowOrLater from './tips-now-or-later';

export default class QuestionLibraryPageTips extends React.PureComponent {

  render () {
    return (
      <TipsNowOrLater {...this.props}>
        More about the Question Library in our "Page tips."
      </TipsNowOrLater>
    );
  }
}
