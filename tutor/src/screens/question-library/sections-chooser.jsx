import { styled, PropTypes, React } from 'vendor';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import Course from '../../models/course';
import { ExercisesMap } from '../../models/exercises';
import Router from '../../helpers/router';
import TourRegion from '../../components/tours/region';
import Chooser from '../../components/sections-chooser';
import Header from '../../components/header';
import { colors } from 'theme';

const StyledHeader = styled(Header)`
  h1 {
    width: 100%;
    margin-bottom: 1.6rem;
  }
`;

const StyledTourRegion = styled(TourRegion)`
  &&& {
    padding: 2rem 3.2rem;
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 3rem;
      margin-bottom: 1.6rem;
    }
    .chapter {
      > div:first-child {
        > span { margin-left: 4rem; }
      }
      > div:last-child {
        > div {
          margin-left: 3rem;
          > span { margin-left: 3rem; }
        }
      }
    }
    .book-link {
      float: right;
    }
  }
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: ${colors.neutral.pale};

  &&& {
    .wrapper {
      margin: 0;
      button {
        padding: 0.5rem 2.5rem;
      }
      .btn + .btn {
        margin-left: 1.6rem;
      }
      .btn-default:not([disabled]) {
        background-color: white;
      }
    }
  }
`;

const StyledHeaderInfo = styled.p`
  font-size: 1.6rem;
  line-height: 2.4rem;
  color: ${colors.neutral.thin};
  margin-bottom: 0;
`;

export default
@observer
class QLSectionsChooser extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    pageIds: PropTypes.array.isRequired,
    exercises: PropTypes.instanceOf(ExercisesMap).isRequired,
    onSelectionsChange: PropTypes.func.isRequired,
  };

  @observable pageIds = this.props.pageIds;

  @action.bound showQuestions() {
    this.props.exercises.fetch({
      limit: false,
      course: this.props.course,
      page_ids: this.pageIds,
    });
    this.props.onSelectionsChange(this.pageIds);
  }

  @action.bound clearQuestions() {
    this.pageIds = [];
    this.props.onSelectionsChange(this.pageIds);
  }

  @action.bound onSectionChange(pageIds) {
    this.pageIds = pageIds;
  }

  headerInfo = () => 
    <StyledHeaderInfo>The Question Library is a collection of peer-reviewed questions included with your course.</StyledHeaderInfo>

  render() {
    return (
      <div className="sections-chooser panel">
        <StyledHeader
          unDocked
          backTo={Router.makePathname('dashboard', { courseId: this.props.course.id })}
          backToText='Dashboard'
          title="Question Library"
          headerContent={this.headerInfo()}
        />
        <StyledTourRegion
          className="sections-list"
          id="question-library-sections-chooser"
          otherTours={['preview-question-library-sections-chooser', 'question-library-super']}
          courseId={this.props.course.id}>
          <div className="book-link">
            <a
              aria-label="Browse the book"
              href={`/book/${this.props.course.id}`}
              target="_blank">
            Browse the book
            </a>
          </div>
          <h2>Select chapter and section to view questions</h2>
          <Chooser
            onSelectionChange={this.onSectionChange}
            selectedPageIds={this.pageIds}
            book={this.props.course.referenceBook}
          />
        </StyledTourRegion>
        <StyledFooter className="section-controls footer">
          <div className="wrapper">
            <Button
              variant="default"
              className="cancel"
              disabled={isEmpty(this.pageIds)}
              onClick={this.clearQuestions}
            >
              Clear selection
            </Button>
            <Button
              variant="primary"
              disabled={isEmpty(this.pageIds)}
              onClick={this.showQuestions}
            >
              Show questions
            </Button>
          </div>
        </StyledFooter>
      </div>
    );
  }
}