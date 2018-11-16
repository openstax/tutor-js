import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId, defaults } from 'lodash';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { React, PropTypes, cn } from '../helpers/react';
import { library } from '@fortawesome/fontawesome-svg-core';

const Icons = {};

// regular
[
  'Calendar',
  'CheckSquare',
  'Circle',
  'Clock',
  'Comment',
  'Comments',
  'Envelope',
  'Square',
].forEach(name => {
  const icon = require(`@fortawesome/free-regular-svg-icons/fa${name}.js`);
  library.add(
    Icons[icon.iconName] = icon.definition,
  );
});

// solid
[
  'AngleDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Ban',
  'Bars',
  'Bullhorn',
  'CaretLeft',
  'CaretRight',
  'CheckCircle',
  'CheckSquare',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'Clock',
  'Comment',
  'Comments',
  'Download',
  'ExclamationCircle',
  'ExclamationTriangle',
  'Eye',
  'Eye',
  'EyeSlash',
  'Ghost',
  'HandPaper',
  'InfoCircle',
  'PaperPlane',
  'PencilAlt',
  'PlusSquare',
  'QuestionCircle',
  'Save',
  'Sort',
  'SortDown',
  'SortUp',
  'Edit',
  'ExternalLinkAlt',
  'Print',
  'Spinner',
  'Th',
  'ThumbsUp',
  'Times',
  'Times',
  'TimesCircle',
  'TrashAlt',
  'UserPlus',
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
        className={cn('ox-icon', type, className)}
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
          className={cn('ox-icon-tt', { 'on-navbar': onNavbar })}
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
