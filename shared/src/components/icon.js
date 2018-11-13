import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId, defaults } from 'lodash';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { React, PropTypes, cn } from '../helpers/react';
import { library } from '@fortawesome/fontawesome-svg-core';

const Icons = {};

// regular
[
  'Square',
  'Calendar',
  'Comments',
  'CheckSquare',
  'Circle',
  'Envelope',
].forEach(name => {
  const icon = require(`@fortawesome/free-regular-svg-icons/fa${name}.js`);
  library.add(
    Icons[icon.iconName] = icon.definition,
  );
});

// solid
[
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'PencilAlt',
  'ArrowDown',
  'CheckCircle',
  'Bars',
  'Bullhorn',
  'HandPaper',
  'Ghost',
  'CheckSquare',
  'QuestionCircle',
  'AngleDown',
  'TimesCircle',
  'Spinner',
  'ExclamationTriangle',
  'ExclamationCircle',
  'Clock',
  'Times',
  'PaperPlane',
  'UserPlus',
  'PlusSquare',
  'Th',
  'Comments',
  'InfoCircle',
  'Eye',
  'Times',
  'CaretLeft',
  'CaretRight',
  'Download',
  'ChevronRight',
  'ChevronUp',
  'ChevronDown',
  'ChevronLeft',
  'EyeSlash',
  'Eye',
  'Trash',
  'Video',
].forEach(name => {
  const icon = require(`@fortawesome/free-solid-svg-icons/fa${name}.js`);
  let iconName = icon.iconName;
  if (Icons[iconName]) { iconName = `${iconName}-solid`; }
  library.add(
    Icons[iconName] = icon.definition,
  );
});

export { Icons };

const defaultTooltipProps = {
  placement: 'top',
  trigger: ['hover', 'focus'],
};

export default
class Icon extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(Object.keys(Icons)).isRequired,
    spin: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onNavbar: PropTypes.bool,
    tooltipProps: PropTypes.object,
    buttonProps: PropTypes.object,
    variant: PropTypes.string,
    btnVariant: PropTypes.string,
    tooltip: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
  };

  static defaultProps = {
    buttonProps: {},
    tooltipProps: defaultTooltipProps,
  };

  uniqueId = uniqueId('icon-tooltip-')

  render() {
    const {
      onClick, buttonProps, tooltipProps, btnVariant,
      type, className, tooltip, onNavbar, variant,
      ...props
    } = this.props;

    //invariant(Icons[type], `${type} has not been imported`);

    let iconEl = (
      <FontAwesomeIcon
        data-variant={variant}
        className={cn('tutor-icon', type, className)}
        icon={Icons[type]}
        {...props}
      />
    );

    if (onClick || btnVariant) {
      iconEl = (
        <Button
          variant={btnVariant || 'plain'}
          className={cn(type, className)}
          onClick={onClick}
          {...buttonProps}
        >{iconEl}</Button>
      );
    }

    if (!tooltip) {
      return iconEl;
    }

    const tooltipEl = React.isValidElement(tooltip) ?
      tooltip : (
        <Tooltip
          id={this.uniqueId}
          className={cn('icon-tt', { 'on-navbar': onNavbar })}
          {...defaults(tooltipProps, defaultTooltipProps)}
        >
          {this.props.tooltip}
        </Tooltip>
      );


    return (
      <OverlayTrigger {...tooltipProps} overlay={tooltipEl}>
        {iconEl}
      </OverlayTrigger>
    );

  }

}

// TutorIcon
//
// import React from 'react';
// import PropTypes from 'prop-types';
// import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import classnames from 'classnames';
// import { propHelpers } from 'shared';
// import { uniqueId, omit } from 'lodash';
//
// export default
// class Icon extends React.Component {
  // static defaultProps = {
  //   tooltipProps: {
  //     placement: 'bottom',
  //     trigger: ['hover', 'focus'],
  //   },
  // };

  // static displayName = 'Icon';

  // static propTypes = {
  //   type: PropTypes.string.isRequired,
  //   spin: PropTypes.bool,
  //   className: PropTypes.string,
  //   onClick: PropTypes.func,
  //   tooltip: PropTypes.oneOfType([
  //     PropTypes.string,
  //     PropTypes.element,
  //   ]),

  //   tooltipProps: PropTypes.object,
  //   onNavbar: PropTypes.bool,
  // };

  // UNSAFE_componentWillMount() {
  //   return this.setState({ uniqueId: uniqueId('icon-tooltip-') });
  // }

  // render() {
  //   const isButton = this.props.onClick || (this.props.tooltip && (this.props.tooltipProps.trigger === 'click'));
  //   const classNames = classnames(
  //     'tutor-icon',
  //     'fa',
  //     `fa-${this.props.type}`,
  //     this.props.className,
  //     {
  //       'fa-spin': this.props.spin,
  //       'clickable': isButton,
  //     },
  //   );

  //   if (!this.props.tooltip) {
  //     const iconProps = omit(this.props, 'tooltipProps', 'spin');
  //     return (
  //       <i
  //         {...iconProps}
  //         role={isButton ? 'button' : 'presentation'}
  //         className={classNames} />
  //     );
  //   }
  //   const buttonProps = propHelpers.removeDefined(this);
  //   const icon = <button {...buttonProps} className={classNames} />;
  //   const tooltip =
  //     <Tooltip
  //       id={this.state.uniqueId}
  //       className={classnames('icon-tt', { 'on-navbar': this.props.onNavbar })}>
  //       {this.props.tooltip}
  //     </Tooltip>;

  //   return (
  //     <OverlayTrigger {...this.props.tooltipProps} overlay={tooltip}>
  //       {icon}
  //     </OverlayTrigger>
  //   );
  // }
// }
