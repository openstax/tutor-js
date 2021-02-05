import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uniqueId, defaults } from 'lodash';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { React, PropTypes, cn } from '../helpers/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import styled, { css } from 'styled-components';

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
  'angle-up':             require('@fortawesome/free-solid-svg-icons/faAngleUp'),
  'angle-left':           require('@fortawesome/free-solid-svg-icons/faAngleLeft'),
  'angle-right':          require('@fortawesome/free-solid-svg-icons/faAngleRight'),
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
  'caret-up':             require('@fortawesome/free-solid-svg-icons/faCaretUp'),
  'caret-down':           require('@fortawesome/free-solid-svg-icons/faCaretDown'),
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
  'cog':                  require('@fortawesome/free-solid-svg-icons/faCog'),
  'comment-solid':        require('@fortawesome/free-solid-svg-icons/faComment'),
  'comments-solid':       require('@fortawesome/free-solid-svg-icons/faComments'),
  'download':             require('@fortawesome/free-solid-svg-icons/faDownload'),
  'edit':                 require('@fortawesome/free-solid-svg-icons/faEdit'),
  'exchange-alt':         require('@fortawesome/free-solid-svg-icons/faExchangeAlt'),
  'exclamation-circle':   require('@fortawesome/free-solid-svg-icons/faExclamationCircle'),
  'exclamation-triangle': require('@fortawesome/free-solid-svg-icons/faExclamationTriangle'),
  'external-link-alt':    require('@fortawesome/free-solid-svg-icons/faExternalLinkAlt'),
  'external-link-square-alt': require('@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt'),
  'eye':                  require('@fortawesome/free-solid-svg-icons/faEye'),
  'eye-slash':            require('@fortawesome/free-solid-svg-icons/faEyeSlash'),
  'ghost':                require('@fortawesome/free-solid-svg-icons/faGhost'),
  'home':                 require('@fortawesome/free-solid-svg-icons/faHome'),
  'hand-paper':           require('@fortawesome/free-solid-svg-icons/faHandPaper'),
  'info-circle':          require('@fortawesome/free-solid-svg-icons/faInfoCircle'),
  'lock':                 require('@fortawesome/free-solid-svg-icons/faLock'),
  'minus':                require('@fortawesome/free-solid-svg-icons/faMinus'),
  'minus-circle':         require('@fortawesome/free-solid-svg-icons/faMinusCircle'),
  'paper-plane':          require('@fortawesome/free-solid-svg-icons/faPaperPlane'),
  'pencil-alt':           require('@fortawesome/free-solid-svg-icons/faPencilAlt'),
  'play-circle':           require('@fortawesome/free-solid-svg-icons/faPlayCircle'),
  'plus':                 require('@fortawesome/free-solid-svg-icons/faPlus'),
  'plus-circle':          require('@fortawesome/free-solid-svg-icons/faPlusCircle'),
  'plus-square':          require('@fortawesome/free-solid-svg-icons/faPlusSquare'),
  'print':                require('@fortawesome/free-solid-svg-icons/faPrint'),
  'question-circle':      require('@fortawesome/free-solid-svg-icons/faQuestionCircle'),
  'recycle':              require('@fortawesome/free-solid-svg-icons/faRecycle'),
  'search':               require('@fortawesome/free-solid-svg-icons/faSearch'),
  'share-square':         require('@fortawesome/free-solid-svg-icons/faShareSquare'),
  'sort':                 require('@fortawesome/free-solid-svg-icons/faSort'),
  'sort-down':            require('@fortawesome/free-solid-svg-icons/faSortDown'),
  'sort-up':              require('@fortawesome/free-solid-svg-icons/faSortUp'),
  'spinner':              require('@fortawesome/free-solid-svg-icons/faSpinner'),
  'star':                 require('@fortawesome/free-solid-svg-icons/faStar'),
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

const IconWrapper = styled(FontAwesomeIcon).withConfig({
  shouldForwardProp: (prop) => prop != 'withCircle',
})`
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  ${({ withCircle }) => withCircle && css`border-radius: 50%; padding: 2px; height: 1.125em; width: 1.125em;`}
  ${({ background }) => background && css`background: ${background};`}
`;

const HOISTED_PROPS = ['data-test-id'];

const Variants = {
  errorInfo: {
    color: '#c2002f',
    type: 'exclamation-circle',
  },
  info: {
    color: '#007da4',
    type: 'exclamation-circle',
  },
  infoCircle: {
    color: '#09c0db',
    type: 'info-circle',
  },
  activity: {
    type: 'spinner',
    spin: true,
  },
  checkedSquare: {
    type: 'check-square-solid',
    color: '#F36B32',
  },
  checkSquare: {
    type: 'square',
    color: '#5E6062',
  },
  circledStar: {
    type: 'star',
    background: '#5e5e5e',
    color: 'white',
    withCircle: true,
  },
  droppedFullCredit: {
    color: '#83AD51',
    type: 'check',
  },
  droppedZeroCredit: {
    color: '#B23238',
    type: 'close',
  },
  toggleOrder: {
    color: '#027EB5',
    type: 'exchange-alt',
  },
  lateWork: {
    color: '#D0021B',
    type: 'clock',
  },
};


export default
class Icon extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(Object.keys(Icons)),
    spin: PropTypes.bool,
    busy: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onNavbar: PropTypes.bool,
    tooltipProps: PropTypes.object,
    buttonProps: PropTypes.object,
    btnVariant: PropTypes.string,
    asButton: PropTypes.bool,
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
      onClick, onBlur, buttonProps, tooltipProps, btnVariant,
      type, className, tooltip, onNavbar, busy, asButton,
      ...props
    } = providedProps;
    props.icon = Icons[type];
    if (busy) {
      props.icon = 'spinner';
      props.spin = true;
    }
    const wrapWithButton = onClick || btnVariant || asButton;


    if (wrapWithButton) {
      HOISTED_PROPS.forEach(prop => {
        if (props[prop]) {
          buttonProps[prop] = props[prop];
          delete props[prop];
        }
      });
    }

    let icon = (
      <IconWrapper
        data-variant={variant}
        className={cn('ox-icon', `ox-icon-${type}`, className)}
        {...props}
      />
    );

    if (wrapWithButton) {

      icon = (
        <Button
          variant={btnVariant || 'plain'}
          className={cn(`ox-icon-${type}`, className, {
            'btn btn-standard btn-icon': asButton,
          })}
          onClick={onClick}
          onBlur={onBlur}
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
