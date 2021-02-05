import { React, cn, styled, useState } from 'vendor'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import OXFancyLoader from 'shared/components/staxly-animation'
import Router from '../../../helpers/router'
import { createPreviewCourse } from '../../../store/courses'
import { Offering } from '../../../store/types'
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
  offering: Offering
  className: string
  history: RouteComponentProps
}

const CoursePreview = ({ offering, className, history } : CoursePreviewProps) => {
  const dispatch = useDispatch()
  const [isCreating, setIsCreating] = useState(false)

  const onClick = () => {
    setIsCreating(true)
    dispatch(createPreviewCourse(offering))
    .then((result) => {
      setIsCreating(false)
      if(!result.error) {
        history.push(Router.makePathname(
          'dashboard', { courseId: result.payload.id },
        ))
      }
    })
  }

  const previewMessage = () => {
    if(isCreating) {
      return <OXFancyLoader isLoading={true} />
    }
    return [
      <h4 key="title">Preview Course</h4>,
      <p key="message">Create test assignments and view sample data</p>,
    ]
  }

  const itemClasses = cn('my-courses-item', 'preview', className, {
  'is-building': isCreating,
  })
  return (
  <StyledPreviewCourse className="my-courses-item-wrapper preview">
      <div
        data-appearance={offering.appearance_code}
        data-test-id="course-card"
        data-is-teacher={true}
        data-offering-id={offering.id}
        className={itemClasses}
      >
      <a
        className="my-courses-item-title"
        onClick={onClick}
      >
          <h3 className="name">{offering.title}</h3>
          <div className="preview-belt">
            {previewMessage()}
          </div>
      </a>
      </div>
  </StyledPreviewCourse>
  )
}

export default withRouter(CoursePreview)