import { debounce } from 'lodash';
import { useEffect } from 'react';

const ScrollElement = document.scrollingElement || document.documentElement;

const ScrollTracker = ({ onScroll }) => {
  useEffect(() => {
    const _onScroll = debounce(() => {
      onScroll({
        scrollTop: ScrollElement.scrollTop,
        clientHeight: ScrollElement.clientHeight,
      });
    }, 10);

    window.addEventListener('scroll', _onScroll, { passive: true });
    return () => window.removeEventListener('scroll', _onScroll);
  });
};

export default ScrollTracker;
