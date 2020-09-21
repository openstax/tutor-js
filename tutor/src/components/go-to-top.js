import { React, styled, observer, observable, action } from 'vendor';
import { debounce } from 'lodash';
import { Icon } from 'shared';
import { colors } from 'theme';


const StyledIcon = styled(Icon)`
  && {
    position: fixed;
    bottom: 80px;
    right: 20px;
    svg {
      width: 32px;
      height: 32px;
      background: ${colors.neutral.pale};
      color: white;
      border-radius: 50%;
      font-size: 2rem;
      margin: 0;
    }
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
    let passiveIfSupported = false;

    try {
      window.addEventListener("test", null,
        Object.defineProperty(
          {},
          "passive",
          {
            get: function() { passiveIfSupported = { passive: false }; }
          }
        )
      );
    } catch(err) {}

    window.addEventListener('scroll', this.onScroll, passiveIfSupported);
  }

  componentWillUnMount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    if (this.show == false) { return null; }
    return (
      <StyledIcon type="angle-up" onClick={this.onClick}>Go To Top</StyledIcon>
    );
  }

}
