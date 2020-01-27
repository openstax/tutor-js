import { React, PropTypes, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import TourRegion from '../../components/tours/region';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { Formik } from 'formik';
import { withRouter } from 'react-router';
import UX from './ux';
import { navbars } from '../../theme.js';

import './styles.scss';

const BackgroundWrapper = styled.div`
  background: #fff;
  min-height: calc(100vh - ${navbars.top.height} - ${navbars.bottom.height});
  position: relative;
  overflow: hidden;
  padding: 0 2.4rem;
`;

@withRouter
@observer
class AssignmentBuilder extends React.Component {

  static displayName = 'AssignmentBuilder';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    let { id, courseId, type } = props.params;

    // eslint-disable-next-line
    const course = props.course || Courses.get(courseId);

    this.ux = new UX();

    this.ux.initialize({
      ...Router.currentQuery(),
      ...props.params,
      course,
      onComplete: this.onComplete,
    });

  }

  render() {
    const { ux } = this;

    if (ux.isInitializing) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    return (
      <BackgroundWrapper>
        <ScrollToTop>
          <TourRegion
            className="assignment-builder"
            id={`${ux.plan.type}-assignment-editor`}
            otherTours={[`${ux.plan.type}-assignment-editor-super`]}
            courseId={ux.course.id}
          >
            <Formik
              initialValues={ux.formValues}
              onSubmit={ux.onSubmit}
              validateOnMount={true}
            >
              {ux.renderStep}
            </Formik>

          </TourRegion>
        </ScrollToTop>
      </BackgroundWrapper>
    );
  }
}

export default AssignmentBuilder;
