import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { compact, map, partial, extend, clone } from 'underscore';

class TutorPopover extends React.Component {
  static defaultProps = {
    maxHeightMultiplier: 0.75,
    maxWidthMultiplier: 0.75,
    windowImpl: window,
  };

  static displayName = 'TutorPopover';

  static propTypes() {
    return {
      content: PropTypes.node.isRequired,
      popoverProps: PropTypes.object,
      contentProps: PropTypes.object,
      overlayProps: PropTypes.object,
      windowImpl: PropTypes.object,
      maxHeightMultiplier: PropTypes.number,
      maxWidthMultiplier: PropTypes.number,
    };
  }

  state = {
    firstShow: true,
    placement: 'right',
    show: false,
    scrollable: false,
    imagesLoading: [],
  };

  componentDidMount() {
    return this.setPlacement();
  }

  getImages = () => {
    const content = this.refs.popcontent;
    return content.querySelectorAll('img');
  };

  setPlacement = () => {
    const placement = this.guessPlacement();
    if (this.state.placement !== placement) { return this.setState({ placement }); }
  };

  areImagesLoading = () => {
    return compact(this.state.imagesLoading).length !== 0;
  };

  checkImages = () => {
    // Make sure the popover re-positions after the image loads
    if ((this.refs.popcontent != null) && this.state.firstShow) {
      const images = this.getImages();

      const imagesLoading = map(images, (image, iter) => {
        if ((image.onload == null) && !image.complete) {
          image.onload = partial(this.imageLoaded, iter);
        }
        return !image.complete;
      });

      return this.setState({ imagesLoading, firstShow: false });
    }
  };

  checkOverlay = () => {
    return this.checkImages();
  };

  guessPlacement = () => {
    window.refs = this.refs;
    const { windowImpl } = this.props;
    const trigger = ReactDOM.findDOMNode(this.refs.popper).getBoundingClientRect().left;
    const midWindow = windowImpl.innerWidth / 2;
    if (trigger > midWindow) { return 'left'; } else { return 'right'; }
  };

  hide = () => {
    this.setState({ show: false });
    return this.refs.popper.hide();
  };

  imageLoaded = (iter) => {
    const { imagesLoading } = this.state;

    const currentImageStatus = clone(imagesLoading);
    currentImageStatus[iter] = false;

    return this.setState({ imagesLoading: currentImageStatus });
  };

  show = () => {
    this.setPlacement();
    this.setState({ show: true });
    return this.refs.popper.show();
  };

  updateOverlayPositioning = () => {
    const { windowImpl } = this.props;
    // updates popper positioning function to
    // explicitly set height so that content
    // can inherit the height for scrolling content
    // @refs.popper.updateOverlayPosition = =>

    const viewer = ReactDOM.findDOMNode(this.refs.popover);
    const { height, width } = viewer.getBoundingClientRect();

    let scrollable = false;

    if (height > windowImpl.innerHeight) {
      scrollable = true;
      viewer.style.height = `${this.props.maxHeightMultiplier * windowImpl.innerHeight}px`;
    }

    if (width > windowImpl.innerWidth) {
      scrollable = true;
      viewer.style.width = `${this.props.maxWidthMultiplier * windowImpl.innerWidth}px`;
    }

    if (this.state.scrollable && !scrollable) {
      viewer.style.height = 'auto';
      viewer.style.width = 'auto';
    }

    return this.setState({ scrollable });
  };

  render() {
    let contentClassName;
    let { children, content, popoverProps, overlayProps, id } = this.props;
    const { scrollable, placement, delayShow } = this.state;

    if (scrollable) {
      popoverProps = clone(popoverProps || {});
      if (popoverProps.className == null) { popoverProps.className = ''; }
      popoverProps.className += ' scrollable';
    }

    if (this.areImagesLoading()) {
      contentClassName = 'image-loading';
    }

    content = React.cloneElement(content, { className: contentClassName });

    const popoverId = id ? `tutor-popover-${id}` : `tutor-popover-${this._reactInternalInstance._rootNodeID}`;

    overlayProps = extend({}, overlayProps, { onEnter: this.checkOverlay, onEntering: this.updateOverlayPositioning });

    const popover = <Popover {...popoverProps} id={popoverId} ref="popover">
      <div ref="popcontent">
        {content}
      </div>
    </Popover>;

    return (
      <OverlayTrigger {...overlayProps} placement={placement} overlay={popover} ref="popper">
        {children}
      </OverlayTrigger>
    );
  }
}

export default TutorPopover;
