import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import keymaster from 'keymaster';

@observer
export default class WindowShade extends React.Component {

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    ux: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    keymaster('esc', this.onEscKey);
  }

  componentWillUnmount() {
    keymaster.unbind('esc', this.onEscKey);
  }

  @action.bound onEscKey() {
    if (this.props.ux.isSummaryVisible) {
      this.props.ux.isSummaryVisible = false;
    }
  }

  render() {
    const { ux, children } = this.props;

    return (
      <div className={`highlights-windowshade ${ux.isSummaryVisible ? 'down' : 'up'}`}>
        <div className='centered-content'>
          {children}
        </div>
      </div>
    );

  }

}
