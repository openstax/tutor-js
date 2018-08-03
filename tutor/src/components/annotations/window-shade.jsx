import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
      <ReactCSSTransitionGroup
        transitionName="animate"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {ux.isSummaryVisible &&
          <div key="shade" className="highlights-windowshade">
            <div className='centered-content'>
              {children}
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );

  }

}
