import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';
import { get, defaultsDeep }      from 'lodash';
import classnames   from 'classnames';

export default class NoFooter extends React.PureComponent {
  className = 'no-footer'

  static contextTypes = {
    router: React.PropTypes.object,
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
        'padding-bottom': 0,
      },
      close: {
        display: 'none',
      },
    });

    const className = classnames(this.className,  this.props.className);

    return (
      <Tooltip
        {...this.props}
        className={className}/>
    );
  }
}
