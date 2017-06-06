import React from 'react';

import TipsNowOrLater from './tips-now-or-later';

export default class DashboardPageTips extends React.PureComponent {

  render () {
    return (
      <TipsNowOrLater {...this.props}>
        Learn more about the dashboard with our "Page tips."
      </TipsNowOrLater>
    );
  }
}
