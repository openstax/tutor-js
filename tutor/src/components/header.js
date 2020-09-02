import { React, PropTypes, observer, styled, css } from 'vendor';
import TutorLink from './link';
import { colors } from 'theme';
import { Icon } from 'shared';
import { breakpoint } from 'theme';

const HeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.neutral.pale};
  padding: 24px 32px;
  ${breakpoint.tablet`
    padding: 24px ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    padding: 16px ${breakpoint.margins.mobile};
  `}

  > div {
    margin-bottom: 8px;
  }

  ${props => props.unDocked && css`
    background-color: ${colors.white};
  `}
`;

const StyledBackLink = styled.div`
  width: 100%;
  a {
    color: ${colors.link};
  }
  .ox-icon { margin-left: 0; }
`;

const StyledTitle = styled.h1`
  font-weight: bold;
  font-size: 3.6rem;
  line-height: 4rem;
  letter-spacing: -0.144rem;
  margin: 0;
  ${breakpoint.mobile`
    font-size: 1.8rem;
    line-height: 3rem;
    letter-spacing: -0.072rem;
  `}
`;

@observer
class Header extends React.Component {
  static propTypes = {
    unDocked: PropTypes.bool.isRequired,
    backTo: PropTypes.string.isRequired,
    backToText: PropTypes.string,
    backToParams: PropTypes.object,
    title: PropTypes.string,
    headerContent: PropTypes.node,
  }
  render() {
    const { unDocked, title, headerContent, backTo, backToText, backToParams, className } = this.props;
    return (
      <HeaderWrapper
        role="dialog"
        tabIndex="-1"
        unDocked={unDocked}
        className={className}
      >
        <StyledBackLink>
          <TutorLink to={backTo} params={backToParams}>
            <Icon
              size="lg"
              type="angle-left"
            />
            {backToText || 'Back'}
          </TutorLink>
        </StyledBackLink>
        {Boolean(title) &&
          <StyledTitle>{title}</StyledTitle>
        }
        {Boolean(headerContent) && headerContent}
      </HeaderWrapper>
    );
  }

}

export default Header;
