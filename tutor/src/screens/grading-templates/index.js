import {
  React, action, PropTypes, observable, observer, styled, computed,
} from 'vendor';
import Courses, { Course } from '../../models/courses-map';
import Loading from 'shared/components/loading-animation';
import { GradingTemplates } from '../../models/grading/templates';
import TemplateCard from './card';
import { ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import * as EDIT_TYPES from './editors';

const CardsBody = styled.div`
  display: flex;
`;

export default
@observer
class GradingTemplatesScreen extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }

  store = new GradingTemplates()
  @observable editing = null;

  @computed get course() {
    return this.props.course || Courses.get(this.props.params.courseId);
  }

  @action.bound onEditComplete() {
    this.editing = null;
  }

  @action.bound onEditTemplate(template) {
    this.editing = template;
  }

  constructor(props) {
    super(props);
    this.store.fetch();
  }

  body() {
    if (this.store.api.isPending) {
      return <Loading message="Fetching templates…" />;
    }

    if (this.editing) {
      const Edit = EDIT_TYPES[this.editing.type];
      if (Edit) {
        return (
          <Edit
            template={this.editing}
            onComplete={this.onEditComplete}
          />
        );
      }
    }

    return (
      <CardsBody>
        {this.store.array.map(tmpl =>
          <TemplateCard
            key={tmpl.id}
            onEdit={this.onEditTemplate}
            template={tmpl}
            store={this.store} />)}
      </CardsBody>
    );

  }

  render() {
    return (
      <ScrollToTop>
        <CoursePage
          course={this.course}
          title="Grading Templates"
        >
          {this.body()}
        </CoursePage>
      </ScrollToTop>
    );
  }

}
