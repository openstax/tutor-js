import PropTypes from 'prop-types';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { get, defaultsDeep }      from 'lodash';
import classnames   from 'classnames';
import NoClose      from './no-close';

export default class NoCloseAndFooter extends React.Component {
  className = 'no-footer'

  static contextTypes = {
    router: PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    if (get(nextProps.step, 'joyrideRef.next')) {
      if (this.unlistenRouteChange) {
        this.unlistenRouteChange();
      }
      this.unlistenRouteChange = this.context.router.history.listen(nextProps.step.joyrideRef.next);
    }
  }

  componentWillUnmount() {
    this.unlistenRouteChange();
  }

  render () {
    defaultsDeep(this.props.step.style, {
      footer: {
        display: 'none',
      },
      main: {
        paddingBottom: 0,
      },
    });

    const className = classnames(this.className, this.props.className);

    return (
      <NoClose
        {...this.props}
        className={className}/>
    );
  }
}
