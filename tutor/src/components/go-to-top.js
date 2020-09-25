import { React, styled, observer, observable, action } from 'vendor';
import { Icon } from 'shared';
import Theme, { breakpoint } from 'theme';
import ScrollTracker from './scroll-tracker';

const StyledIcon = styled(Icon)`
  &&.btn {
    position: fixed;
    bottom: 52px;
    right: 52px;
    z-index: ${Theme.zIndex.goToTop};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    svg {
      width: 32px;
      height: 32px;
      padding: 4px;
      background: #959595;
      color: white;
      border-radius: 50%;
      font-size: 1.6rem;
      margin: 8px;
      box-shadow: 0 0 4px 0 #00000020;
    }

    &:hover {
      box-shadow: none;
      svg {
        box-shadow: 0 0 4px 0 #00000040;
      }
    }
  }

  .modal-open & {
    display: none;
  }
  ${breakpoint.mobile`
    display: none;
  `};
`;

const scrollStore = observable({
  scrollTop: 0,
  clientHeight: 0,
});

const GoToTop = observer(() => {
  const onScroll = ({ scrollTop, clientHeight }) => {
    scrollStore.scrollTop = scrollTop;
    scrollStore.clientHeight = clientHeight;
  };
  const onClick = () => {
    document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const listener = ScrollTracker({ onScroll: onScroll });

  if (!(scrollStore.scrollTop > scrollStore.clientHeight * 4))
    return null;

  return (
    <StyledIcon
      type="angle-up"
      onClick={onClick}
      title="Go to the top of the page"
    >
      Go To Top
    </StyledIcon>
  );
});

export default GoToTop;
