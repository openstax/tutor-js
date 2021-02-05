import { React, cn, styled } from 'vendor'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { OfferingWithCourses } from './index'
import OXFancyLoader from 'shared/components/staxly-animation'
import Router from '../../../helpers/router'
import { createPreviewCourse } from '../../../store/courses'
import { colors } from 'theme'

const StyledPreviewCourse = styled.div`
  &&& {
    a .preview-belt {
      background: white;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
      bottom: 40%;
      h4 {
        font-size: 1.8rem;
        line-height: 2rem;
        font-weight: 600;
      }
      p {
        color: ${colors.neutral.thin};
      }
    }
  }
`

interface CoursePreviewProps {
  offeringWithCourses: OfferingWithCourses
  className: string
  history: RouteComponentProps
}

const CoursePreview = ({ offeringWithCourses, className, history } : CoursePreviewProps) => {
  const dispatch = useDispatch()

  const redirectToCourse = (courseId) => {

    history.push(Router.makePathname(
      'dashboard', { courseId },
    ))
  }

  const onClick = () => {
    dispatch(createPreviewCourse(offeringWithCourses))
    .then((result) => {
      if(!result.error) 
        redirectToCourse(result.payload.course.id)
    })
  }

  const previewMessage = () => {
    // if (aCourse.isBuilding) {
    //   return <h4 key="title">Loading Preview Course</h4>
    // }
    return [
      <h4 key="title">Preview Course</h4>,
      <p key="message">Create test assignments and view sample data</p>,
    ]
  }

  // const itemClasses = cn('my-courses-item', 'preview', className, {
  // 'is-building': aCourse.isBuilding,
  // })
  const itemClasses = cn('my-courses-item', 'preview', className)
  return (
  <StyledPreviewCourse className="my-courses-item-wrapper preview">
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
          {/* <OXFancyLoader isLoading={aCourse.isBuilding} /> */}
          <OXFancyLoader />
          </div>
      </a>
      </div>
  </StyledPreviewCourse>
  )
}

export default withRouter(CoursePreview)