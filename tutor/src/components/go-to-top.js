import { React, styled, observer, observable, action } from 'vendor';
import { debounce } from 'lodash';
import { Icon } from 'shared';
import Theme from 'theme';


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
`;

export default
@observer
class GoToTop extends React.Component {
  @observable show = false;

  @action.bound onScroll() {
    const el = document.scrollingElement;
    if (el.scrollTop > (el.clientHeight * 4)) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  @action.bound onClick() {
    document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  componentWillMount() {
    this.onScroll = debounce(this.onScroll, 10);
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  componentWillUnMount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    if (this.show == false) { return null; }
    return (
      <StyledIcon
        type="angle-up"
        onClick={this.onClick}
        title="Go to the top of the page"
      >
        Go To Top
      </StyledIcon>
    );
  }

}
