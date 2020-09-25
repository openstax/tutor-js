import { debounce } from 'lodash';
import { useEffect } from 'react';

const ScrollElement = document.scrollingElement || document.documentElement;

const ScrollTracker = ({ onScroll }) => {
  useEffect(() => {
    const _onScroll = () => {
      onScroll({
        scrollTop: ScrollElement.scrollTop,
        clientHeight: ScrollElement.clientHeight,
      });
    };

    window.addEventListener('scroll', debounce(_onScroll, 10), { passive: true });
    return () => window.removeEventListener('scroll', _onScroll);
  });
};

export default ScrollTracker;
