import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId, defaults } from 'lodash';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { React, PropTypes, cn } from '../helpers/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components';

// Don't attempt to remove the duplication by using variable substition without testing ;)
// After trying multiple methods, it seems like webpack 4 will either:
//   * require all icons in the build
//   * fail to load required icons
const Icons = {
  // regular
  'calendar':             require('@fortawesome/free-regular-svg-icons/faCalendar.js'),
  'check-square':         require('@fortawesome/free-regular-svg-icons/faCheckSquare'),
  'circle':               require('@fortawesome/free-regular-svg-icons/faCircle'),
  'clock':                require('@fortawesome/free-regular-svg-icons/faClock'),
  'comment':              require('@fortawesome/free-regular-svg-icons/faComment'),
  'comments':             require('@fortawesome/free-regular-svg-icons/faComments'),
  'envelope':             require('@fortawesome/free-regular-svg-icons/faEnvelope'),
  'square':               require('@fortawesome/free-regular-svg-icons/faSquare'),

  // solid
  'angle-down':           require('@fortawesome/free-solid-svg-icons/faAngleDown'),
  'arrow-circle-down':    require('@fortawesome/free-solid-svg-icons/faArrowCircleDown'),
  'arrow-circle-left':    require('@fortawesome/free-solid-svg-icons/faArrowCircleLeft'),
  'arrow-circle-right':   require('@fortawesome/free-solid-svg-icons/faArrowCircleRight'),
  'arrow-circle-up':      require('@fortawesome/free-solid-svg-icons/faArrowCircleUp'),
  'arrow-down':           require('@fortawesome/free-solid-svg-icons/faArrowDown'),
  'arrow-left':           require('@fortawesome/free-solid-svg-icons/faArrowLeft'),
  'arrow-right':          require('@fortawesome/free-solid-svg-icons/faArrowRight'),
  'arrow-up':             require('@fortawesome/free-solid-svg-icons/faArrowUp'),
  'ban':                  require('@fortawesome/free-solid-svg-icons/faBan'),
  'bars':                 require('@fortawesome/free-solid-svg-icons/faBars'),
  'bookmark':             require('@fortawesome/free-solid-svg-icons/faBookmark'),
  'bullhorn':             require('@fortawesome/free-solid-svg-icons/faBullhorn'),
  'caret-left':           require('@fortawesome/free-solid-svg-icons/faCaretLeft'),
  'caret-right':          require('@fortawesome/free-solid-svg-icons/faCaretRight'),
  'check':                require('@fortawesome/free-solid-svg-icons/faCheck'),
  'check-circle':         require('@fortawesome/free-solid-svg-icons/faCheckCircle'),
  'check-square-solid':   require('@fortawesome/free-solid-svg-icons/faCheckSquare'),
  'cheveron-left':        require('@fortawesome/free-solid-svg-icons/faChevronLeft'),
  'chevron-down':         require('@fortawesome/free-solid-svg-icons/faChevronDown'),
  'chevron-left':         require('@fortawesome/free-solid-svg-icons/faChevronLeft'),
  'chevron-right':        require('@fortawesome/free-solid-svg-icons/faChevronRight'),
  'chevron-up':           require('@fortawesome/free-solid-svg-icons/faChevronUp'),
  'clock-solid':          require('@fortawesome/free-solid-svg-icons/faClock'),
  'close':                require('@fortawesome/free-solid-svg-icons/faTimes'),
  'close-circle':         require('@fortawesome/free-solid-svg-icons/faTimesCircle'),
  'comment-solid':        require('@fortawesome/free-solid-svg-icons/faComment'),
  'comments-solid':       require('@fortawesome/free-solid-svg-icons/faComments'),
  'download':             require('@fortawesome/free-solid-svg-icons/faDownload'),
  'edit':                 require('@fortawesome/free-solid-svg-icons/faEdit'),
  'exclamation-circle':   require('@fortawesome/free-solid-svg-icons/faExclamationCircle'),
  'exclamation-triangle': require('@fortawesome/free-solid-svg-icons/faExclamationTriangle'),
  'external-link-alt':    require('@fortawesome/free-solid-svg-icons/faExternalLinkAlt'),
  'eye':                  require('@fortawesome/free-solid-svg-icons/faEye'),
  'eye-slash':            require('@fortawesome/free-solid-svg-icons/faEyeSlash'),
  'ghost':                require('@fortawesome/free-solid-svg-icons/faGhost'),
  'hand-paper':           require('@fortawesome/free-solid-svg-icons/faHandPaper'),
  'info-circle':          require('@fortawesome/free-solid-svg-icons/faInfoCircle'),
  'lock':                 require('@fortawesome/free-solid-svg-icons/faLock'),
  'paper-plane':          require('@fortawesome/free-solid-svg-icons/faPaperPlane'),
  'pencil-alt':           require('@fortawesome/free-solid-svg-icons/faPencilAlt'),
  'plus-circle':          require('@fortawesome/free-solid-svg-icons/faPlusCircle'),
  'plus-square':          require('@fortawesome/free-solid-svg-icons/faPlusSquare'),
  'print':                require('@fortawesome/free-solid-svg-icons/faPrint'),
  'question-circle':      require('@fortawesome/free-solid-svg-icons/faQuestionCircle'),
  'sort':                 require('@fortawesome/free-solid-svg-icons/faSort'),
  'sort-down':            require('@fortawesome/free-solid-svg-icons/faSortDown'),
  'sort-up':              require('@fortawesome/free-solid-svg-icons/faSortUp'),
  'spinner':              require('@fortawesome/free-solid-svg-icons/faSpinner'),
  'th':                   require('@fortawesome/free-solid-svg-icons/faTh'),
  'thumbs-up':            require('@fortawesome/free-solid-svg-icons/faThumbsUp'),
  'trash':                require('@fortawesome/free-solid-svg-icons/faTrashAlt'),
  'user-plus':            require('@fortawesome/free-solid-svg-icons/faUserPlus'),
  'video':                require('@fortawesome/free-solid-svg-icons/faVideo'),

  // custom definitions
  'glasses':              require('./icons/glasses'),

};

Object.keys(Icons).forEach(k => {
  const icon = Icons[k];
  if (icon) {
    library.add(icon.definition);
    Icons[k] = icon.definition;
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Icon ${k} was not imported correctly`);
  }
});

// aliases
Icons['wrong'] = Icons['close'];

export { Icons };

const defaultTooltipProps = {
  placement: 'auto',
  trigger: ['hover', 'focus'],
};

const IconWrapper = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  margin-left: 0.5rem;
`;


const Variants = {
  errorInfo: {
    color: '#c2002f',
    type: 'exclamation-circle',
  },
  info: {
    color: '#007da4',
    type: 'exclamation-circle',
  },
  activity: {
    type: 'spinner',
    spin: true,
  },
};

export default
class Icon extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(Object.keys(Icons)),
    spin: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onNavbar: PropTypes.bool,
    tooltipProps: PropTypes.object,
    buttonProps: PropTypes.object,
    btnVariant: PropTypes.string,
    variant: PropTypes.oneOf(Object.keys(Variants)),
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
    let { variant, ...providedProps } = this.props;
    if (variant) {
      defaults(providedProps, Variants[variant]);
    }

    const {
      onClick, buttonProps, tooltipProps, btnVariant,
      type, className, tooltip, onNavbar,
      ...props
    } = providedProps;

    let icon = (
      <IconWrapper
        data-variant={variant}
        className={cn('ox-icon', `ox-icon-${type}`, className)}
        icon={Icons[type]}
        {...props}
      />
    );

    if (onClick || btnVariant) {
      icon = (
        <Button
          variant={btnVariant || 'plain'}
          className={cn(`ox-icon-${type}`, className)}
          onClick={onClick}
          {...buttonProps}
        >{icon}</Button>
      );
    }

    if (!tooltip) {
      return icon;
    }

    const tooltipEl = (
      <Tooltip
        id={this.uniqueId}
        className={cn('ox-icon-tt', { 'on-navbar': onNavbar })}
        {...defaults(tooltipProps, defaultTooltipProps)}
      >
        {tooltip}
      </Tooltip>
    );

    return (
      <OverlayTrigger {...tooltipProps} overlay={tooltipEl}>
        {icon}
      </OverlayTrigger>
    );

  }

}
