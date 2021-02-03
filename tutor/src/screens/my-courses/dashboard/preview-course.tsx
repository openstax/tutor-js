import { React, cn } from 'vendor';
import { last } from 'lodash'
import Router from '../../../helpers/router';
import { Icon } from 'shared';
import OXFancyLoader from 'shared/components/staxly-animation';

const CoursePreview = ({ offeringWithCourses, className }) => {
    const aCourse = last(offeringWithCourses.courses)
    // static propTypes = {
    //   course: PropTypes.instanceOf(CourseModel).isRequired,
    //   className: PropTypes.string,
    //   history: PropTypes.object.isRequired,
    // }
  
    // @computed get ux () {
    //   return new CourseUX(this.props.course);
    // }
  
    const redirectToCourse = () => {
      if ( !aCourse.previewCourse ) { return; }
      this.props.history.push(Router.makePathname(
        'dashboard', { courseId: aCourse.previewCourse.id },
      ));
    }
  
    const onClick = () => {
      if (aCourse.isCreated) {
        this.redirectToCourse();
      } else {
        aCourse.build().then(redirectToCourse());
      }
    }
  
    const previewMessage = () => {
      if (aCourse.isBuilding) {
        return <h4 key="title">Loading Preview</h4>;
      }
      return [
        <h4 key="title"><Icon type="eye" /> Preview</h4>,
        <p key="message">Check out a course with assignments and sample data</p>,
      ];
    }
  
    const itemClasses = cn('my-courses-item', 'preview', className, {
    'is-building': aCourse.isBuilding,
    });
    return (
    <div className="my-courses-item-wrapper preview">
        <div
          data-appearance={offeringWithCourses.appearance_code}
          data-test-id="course-card"
          data-is-teacher={true}
          data-offering-id={offeringWithCourses.id}
          className={itemClasses}
        >
        <a
          className="my-courses-item-title"
          onClick={onClick}
        >
            <h3 className="name">{offeringWithCourses.title}</h3>
            <div className="preview-belt">
            {previewMessage()}
            <OXFancyLoader isLoading={aCourse.isBuilding} />
            </div>
        </a>
        </div>
    </div>
    );
}

export default CoursePreview;