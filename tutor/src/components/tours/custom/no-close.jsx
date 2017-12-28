import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';
import { defaultsDeep }      from 'lodash';
import classnames   from 'classnames';

export default class NoClose extends React.PureComponent {
  className = 'no-close'

  static contextTypes = {
    router: React.PropTypes.object,
  }

  render () {
    defaultsDeep(this.props.step.style, {
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
