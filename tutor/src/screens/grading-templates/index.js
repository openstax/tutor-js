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
import { Col, Row, Container } from 'react-bootstrap';

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
      <Container fluid={true}>
        <Row>
          <Col>
            <p>Manage pre-set submission and grading policy templates here. These templates can be applied to multiple assignments.</p>
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
