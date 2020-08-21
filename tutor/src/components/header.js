import { React, PropTypes, observer, styled, css } from 'vendor';
import TutorLink from './link';
import { colors } from 'theme';
import { Icon } from 'shared';

const ExercisesTaskHeaderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  padding: 25px 0 10px;
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

    ${({ theme }) => theme.breakpoint.only.mobile`
      margin-left: 0;
      margin-right: 0;
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
`;

@observer
class Header extends React.Component {
  static propTypes = {
    unDocked: PropTypes.bool.isRequired,
    courseId: PropTypes.string.isRequired,
    title: PropTypes.string,
    headerContent: PropTypes.node,
  }
  render() {
    const { unDocked, courseId, title, headerContent } = this.props;
    return (
      <ExercisesTaskHeaderWrapper
        className="task-homework breadcrumbs-wrapper"
        role="dialog"
        tabIndex="-1"
        unDocked={unDocked}
      >
        <StyledBackLink>
          <TutorLink to="dashboard" params={{ courseId }}>
            <Icon
              size="lg"
              type="angle-left"
              className="-move-exercise-up circle"
            />
              Dashboard
          </TutorLink>
        </StyledBackLink>
        {
          Boolean(title) && 
            <StyledTitle>{title}</StyledTitle>
        }
        {Boolean(headerContent) && headerContent}
      </ExercisesTaskHeaderWrapper>
    );
  }
    
}

export default Header;
