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

const StyledHeader = styled(Header)`
  h1 {
    width: 100%;
    margin-bottom: 1.6rem;
  }
  p {
    margin-bottom: 0;
  }
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

  render() {
    return (
      <div className="sections-chooser panel">
        <StyledHeader
          unDocked
          backTo={Router.makePathname('dashboard', { courseId: this.props.course.id })}
          backToText='Dashboard'
          title="Question Library"
          headerContent={<p>The Question Library is a collection of peer-reviewed questions included with your course.</p>}
        />
        <TourRegion
          className="sections-list"
          id="question-library-sections-chooser"
          otherTours={['preview-question-library-sections-chooser', 'question-library-super']}
          courseId={this.props.course.id}>
          <Chooser
            onSelectionChange={this.onSectionChange}
            selectedPageIds={this.pageIds}
            book={this.props.course.referenceBook}
          />
        </TourRegion>
        <div className="section-controls footer">
          <div className="wrapper">
            <Button
              variant="primary"
              disabled={isEmpty(this.pageIds)}
              onClick={this.showQuestions}
            >
              Show Questions
            </Button>
            <Button
              variant="default"
              className="cancel"
              onClick={this.clearQuestions}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}