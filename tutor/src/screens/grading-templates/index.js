import {
  React, action, PropTypes, observable, observer, computed, styled,
} from 'vendor';
import Courses, { Course } from '../../models/courses-map';
import Theme from '../../theme';
import Loading from 'shared/components/loading-animation';
import { GradingTemplates } from '../../models/grading/templates';
import TemplateCard from './card';
import { ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import * as EDIT_TYPES from './editors';
import { Col, Row, Container, Button } from 'react-bootstrap';
import CourseBreadcrumb from '../../components/course-breadcrumb';

const Instructions = styled.p`
  font-size: 1.8rem;
`;

const Templates = styled(CoursePage)`
  min-height: calc(100vh - ${Theme.navbars.top.height});
  background-color: wheat;
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

  constructor(props) {
    super(props);
    this.store.fetch();
  }

  componentDidMount() {
    document.body.classList.add('light');
  }

  componentWillUnmount() {
    document.body.classList.remove('light');
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

  @action.bound onAdd() {
    this.editing = { task_plan_type: 'create' };
  }

  @action.bound onCreateTypeSelection(task_plan_type) {
    this.editing = this.store.newTemplate({ task_plan_type });
  }

  body() {
    if (this.store.api.isPending) {
      return <Loading message="Fetching templates…" />;
    }
    let modal;

    if (this.editing) {
      const Edit = EDIT_TYPES[this.editing.task_plan_type];
      if (Edit) {
        modal = (
          <Edit
            template={this.editing}
            onComplete={this.onEditComplete}
            onCreateTypeSelection={this.onCreateTypeSelection}
          />
        );
      }
    }

    return (
      <Container fluid={true}>
        {modal}
        <Row>
          <Col>
            <Instructions>Manage pre-set submission and grading policy templates here. These templates can be applied to multiple assignments.</Instructions>
          </Col>
        </Row>
        <Row>
          {this.store.array.map(tmpl =>
            <Col key={tmpl.id} lg={4} md={6} sm={12} xs={12}>
              <TemplateCard
                onEdit={this.onEditTemplate}
                template={tmpl}
                store={this.store} />
            </Col>
          )}
        </Row>
      </Container>
    );
  }

  titleControls() {
    return <Button onClick={this.onAdd} size="lg">Add new template</Button>;
  }

  titleBreadcrumbs() {
    return <CourseBreadcrumb course={this.course} currentTitle="Grading Templates" />;
  }

  render() {
    return (
      <ScrollToTop>
        <Templates
          course={this.course}
          title="Grading Templates"
          titleControls={this.titleControls()}
          titleBreadcrumbs={this.titleBreadcrumbs()}
          titleAppearance="light"
        >
          {this.body()}
        </Templates>
      </ScrollToTop>
    );
  }

}
