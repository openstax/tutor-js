import {
  React, action, PropTypes, observable, observer, computed, styled,
} from 'vendor';
import { Col, Row, Container, Button } from 'react-bootstrap';
import Courses, { Course } from '../../models/courses-map';
import Theme from '../../theme';
import Loading from 'shared/components/loading-animation';
import { GradingTemplates } from '../../models/grading/templates';
import Card from './card';
import DeleteModal from './delete-modal';
import { ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import * as EDIT_TYPES from './editors';
import CourseBreadcrumb from '../../components/course-breadcrumb';

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  border-bottom: 1px solid ${Theme.colors.neutral.pale};
  padding-bottom: 1.6rem;
  > :first-child {
    margin: 0;
    h2 { margin-bottom: 0; }
  }
`;

const Instructions = styled.p`
  font-size: 1.6rem;
  line-height: 2.5rem;
  a {
    text-decoration: underline;
  }
`;

const Templates = styled(CoursePage)`
  min-height: calc(100vh - ${Theme.navbars.top.height});
  background-color: #fff;
`;

export default
@observer
class GradingTemplatesScreen extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    gradingTemplates: PropTypes.instanceOf(GradingTemplates),
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }

  @observable editing = null;
  @observable deleting = null;

  componentDidMount() {
    this.store.fetch();
  }

  @computed get course() {
    return this.props.course || Courses.get(this.props.params.courseId);
  }

  @computed get store() {
    return this.props.gradingTemplates || this.course.gradingTemplates;
  }

  @action.bound onEditComplete() {
    this.editing = null;
  }

  @action.bound onEditTemplate(template) {
    this.editing = template;
  }

  @action.bound onConfirmDelete(template) {
    this.deleting = template;
  }

  @action.bound onDeleteComplete() {
    this.deleting = null;
  }

  @action.bound onDeleteTemplate(template) {
    template.remove();
    this.onDeleteComplete();
  }

  @action.bound onAdd() {
    this.editing = { task_plan_type: 'create' };
  }

  @action.bound onCreateTypeSelection(task_plan_type) {
    this.editing = this.store.newTemplate({ task_plan_type });
  }

  @computed get modal() {
    if (this.editing) {
      const Edit = EDIT_TYPES[this.editing.task_plan_type];
      if (Edit) {
        return (
          <Edit
            template={this.editing}
            onComplete={this.onEditComplete}
            onCreateTypeSelection={this.onCreateTypeSelection}
          />
        );
      }
    }

    if (this.deleting) {
      return (
        <DeleteModal
          onDelete={this.onDeleteTemplate}
          onCancel={this.onDeleteComplete}
          template={this.deleting}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <ScrollToTop>
        <Templates
          course={this.course}
          titleAppearance="light"
        >
          <Container fluid={true}>
            {this.modal}
            <Heading>
              <CourseBreadcrumb
                course={this.course}
                currentTitle="Grading templates"
              />
              {this.course.isWRM && <Button onClick={this.onAdd} size="lg">Add new template</Button>}
            </Heading>
            <Row>
              <Col>
                <Instructions>
                  Manage pre-set submission and grading policy templates here. These
                  templates can be applied to multiple assignments. Template applied
                  to open assignments cannot be edited or deleted. <a href="">Learn more</a>
                </Instructions>
              </Col>
            </Row>
            <Row>
              {this.store.api.isPendingInitialFetch && <Loading message="Fetching templates…" />}
              {this.store.undeleted.array.map(template => (
                <Card
                  key={template.id}
                  template={template}
                  onEdit={this.onEditTemplate}
                  onDelete={this.onConfirmDelete}
                />))}
            </Row>
          </Container>
        </Templates>
      </ScrollToTop>
    );
  }

}
