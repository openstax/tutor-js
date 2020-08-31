import { React, PropTypes, observer, styled, css } from 'vendor';
import TutorLink from './link';
import { colors, breakpoint } from 'theme';
import { Icon } from 'shared';

const ExercisesTaskHeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  padding: 25px 0 10px;
  ${({ theme }) => theme.breakpoint.only.mobile`
    padding-bottom: 0;
  `}
  border-bottom: 1px solid ${colors.neutral.pale};
  > div {
      margin-bottom: 12px;
    }

  ${props => props.unDocked && css`
    background-color: ${colors.white};
  `}

  .sticky-table {
    margin-left: 15px;
    margin-right: 15px;

    ${breakpoint.only.mobile`
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 0;
    `};
  }
`;

const StyledBackLink = styled.div`
  width: 100%;
  color: ${colors.link};
  padding-left: 10px;
`;

const StyledTitle = styled.h1`
  font-size: 3.5rem;
  padding-left: 12px;

  ${breakpoint.only.mobile`
     font-size: 2.5rem;
  `};
`;

@observer
class Header extends React.Component {
  static propTypes = {
    unDocked: PropTypes.bool.isRequired,
    backTo: PropTypes.string.isRequired,
    backToText: PropTypes.string,
    title: PropTypes.string,
    headerContent: PropTypes.node,
  }
  render() {
    const { unDocked, title, headerContent, backTo, backToText } = this.props;
    return (
      <ExercisesTaskHeaderWrapper
        className="task-homework breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
        unDocked={unDocked}
      >
        <StyledBackLink>
          <TutorLink to={backTo}>
            <Icon
              size="lg"
              type="angle-left"
              className="-move-exercise-up circle"
            />
            {backToText || 'Back'}
          </TutorLink>
        </StyledBackLink>
        {Boolean(title) &&
          <StyledTitle>{title}</StyledTitle>
        }
        {Boolean(headerContent) && headerContent}
      </ExercisesTaskHeaderWrapper>
    );
  }

}

export default Header;
