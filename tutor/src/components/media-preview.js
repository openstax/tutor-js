import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import TutorPopover from './tutor-popover';
import { ArbitraryHtmlAndMath } from 'shared';

import _ from 'underscore';
import S from '../helpers/string';

import { MediaStore } from '../flux/media';

function getTargetClassList(el) {
    if (el.parentElement && el.parentElement.matches('.os-figure')) {
        return el.parentElement.classList;
    }
    return el.classList;
}

export default
class MediaPreview extends React.Component {
  static defaultProps = {
      buffer: 160,
      shouldLinkOut: false,
      windowImpl: window,
      trigger: 'focus',
  };

  static displayName = 'MediaPreview';

  static propTypes = {
      mediaId: PropTypes.string.isRequired,
      bookHref: PropTypes.string.isRequired,
      cnxId: PropTypes.string.isRequired,
      mediaDOMOnParent: PropTypes.object,
      windowImpl: PropTypes.object,
      buffer: PropTypes.number,
      shouldLinkOut: PropTypes.bool,
      originalHref: PropTypes.string,
      html: PropTypes.string,
  };

  state = {
      popped: false,
      stick: false,
      media: null,
  };

  componentWillUnmount() {
      const { mediaId } = this.props;
      return MediaStore.off(`loaded.${mediaId}`, this.updateMedia);
  }

  onMouseEnter = (mouseEvent) => {
      mouseEvent.preventDefault();
      return this.showMedia();
  };

  onMouseLeave = (mouseEvent) => {
      mouseEvent.preventDefault();
      if (this.isMouseExited(mouseEvent)) { this.hideMedia(); }
  };

  getLinkProps = (otherProps) => {
      const { mediaId, mediaDOMOnParent, bookHref, shouldLinkOut, originalHref } = this.props;
      const { media } = this.state;

      const otherPropTypes = _.chain(otherProps)
          .keys()
          .union(['mediaId', 'children', 'mediaDOMOnParent', 'buffer'])
          .union(_.keys(this.constructor.propTypes))
          .value();

      // most props should pass on
      const linkProps = _.omit(this.props, otherPropTypes);
      linkProps['data-targeted'] = 'media';

      if (mediaDOMOnParent != null) {
          linkProps.href = `#${mediaId}`;
      } else if (media && shouldLinkOut) { // or not media
          linkProps.href = bookHref;
          if (mediaId) { linkProps.href += `#${mediaId}`; }
          linkProps.target = '_blank';
      } else if (!media) {
          linkProps.href = originalHref;
          linkProps.target = '_blank';
      }

      linkProps.onMouseEnter = this.onMouseEnter;
      linkProps.onMouseLeave = this.onMouseLeave;

      const defaultClassName = 'media-preview-link';
      if (linkProps.className != null) { linkProps.className += ` ${defaultClassName}`; }
      if (linkProps.className == null) { linkProps.className = defaultClassName; }

      return linkProps;
  };

  getOverlayProps = () => {
      return _.pick(this.props, 'containerPadding', 'trigger');
  };

  UNSAFE_componentWillMount() {
      const { mediaId } = this.props;
      const media = MediaStore.get(mediaId);
      if (media != null) { this.updateMedia(media); }
  }

  checkShouldPop = () => {
      if (!this.props.mediaDOMOnParent) { return true; }
      return !this.isMediaInViewport();
  };

  hideMedia = () => {
      if (this.state.popped) {
          if (!this.state.stick) {
              this.setState({ popped: false });
              this.refs.overlay.hide();
          }
      } else {
          this.unhighlightMedia();
      }
  };

  highlightMedia = () => {
      const { mediaDOMOnParent } = this.props;
      return (mediaDOMOnParent != null ? getTargetClassList(mediaDOMOnParent).add('link-target') : undefined);
  };

  isMediaInViewport = () => {
      let middle;
      const { mediaDOMOnParent, buffer, windowImpl } = this.props;
      const mediaRect = mediaDOMOnParent != null ? mediaDOMOnParent.getBoundingClientRect() : undefined;

      return 0 <= ((middle = mediaRect.top + buffer)) && middle <= windowImpl.innerHeight;
  };

  // check that mouse has exited both the link and the overlay
  isMouseExited = (mouseEvent) => {
      if (((mouseEvent.relatedTarget != null ? mouseEvent.relatedTarget.nodeType : undefined) == null) || (this.refs.overlay.refs.popover == null)) { return true; }
      const linkDOM = ReactDOM.findDOMNode(this.refs.overlay.refs.popper);
      const popoverDOM = ReactDOM.findDOMNode(this.refs.overlay.refs.popover);
      return !(popoverDOM.contains(mouseEvent.relatedTarget) || linkDOM.isEqualNode(mouseEvent.relatedTarget));
  };

  showMedia = () => {
      if (this.state.stick) { return; }
      const shouldPop = this.checkShouldPop();
      if (shouldPop) {
          if (!this.state.popped) {
              this.setState({ popped: true });
              this.refs.overlay.show();
          }
      } else {
          this.highlightMedia();
      }
  };

  stickMedia = () => {
      this.setState({ stick: true });
      if (!this.state.popped) {
          this.setState({ popped: true });
          this.refs.overlay.show();
      }
  };

  unhighlightMedia = () => {
      const { mediaDOMOnParent } = this.props;
      return (mediaDOMOnParent != null ? getTargetClassList(mediaDOMOnParent).remove('link-target') : undefined);
  };

  updateMedia = (media) => {
      return this.setState({ media });
  };

  render() {
      const { html, windowImpl } = this.props;
      const { media } = this.state;

      const overlayProps = this.getOverlayProps();
      let linkProps = this.getLinkProps(overlayProps);

      if (media != null) {
          let linkText;
          const contentHtml = media.html;
          const contentProps =
        { className: 'media-preview-content' };
          const popoverProps = {
              'data-content-type': media.name,
              className: 'media-preview',
              ref: 'popover',
              onMouseLeave: this.onMouseLeave,
          };

          const content = <ArbitraryHtmlAndMath {...contentProps} html={contentHtml} />;
          const allProps = { content, overlayProps, popoverProps, windowImpl };

          if (html !== '[link]') { linkText = html; }
          if (linkText == null) { linkText = `See ${S.capitalize(media.name)}`; }

          return (
              <TutorPopover {...allProps} ref="overlay">
                  <a {...linkProps} dangerouslySetInnerHTML={{ __html: linkText }} />
              </TutorPopover>
          );
      } else {
          linkProps = _.omit(linkProps, 'onMouseEnter', 'onMouseLeave');
          return (
              <a {...linkProps} dangerouslySetInnerHTML={{ __html: html }} />
          );
      }
  }
}
