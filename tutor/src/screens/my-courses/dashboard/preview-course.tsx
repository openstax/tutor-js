import { React, cn, styled, useState } from 'vendor'
import { Dropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import OXFancyLoader from 'shared/components/staxly-animation'
import Router from '../../../helpers/router'
import { createPreviewCourse } from '../../../store/courses'
import { Offering } from '../../../store/types'
import { colors } from 'theme'
import { Icon } from 'shared'

const StyledPreviewCourse = styled.div`
  &&& {
    svg[data-icon="ellipsis-v"] {
      float: right;
      margin-right: 2rem;
      margin-top: 2rem;
    }
    .my-courses-item-title {
        h3 {
          width: 20rem;
          padding: 1.5rem;
        }
        .preview-belt {
        background: white;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
        bottom: 40%;
        h4 {
          font-size: 1.8rem;
          line-height: 2rem;
          font-weight: 600;
          color: ${colors.neutral.thin};
        }
        p {
          color: ${colors.neutral.thin};
        }
      }
    }
    .my-courses-item-actions {
      position: absolute;
      right: 0;
      top: 30px;
      .dropdown-toggle {
        padding: 0;
        &:after {
          display: none;
        }
      }
      .dropdown-menu {
        border: 1px solid #d5d5d5;
        box-shadow: 0px 2px 4px rgb(0 0 0 / 20%);
        border-radius: 0;
        a {
          padding: 1rem 1.5rem;
          color: #5e6062;
          font-size: 1.6rem;
          &:hover {
            background: #f1f1f1;
            color: #424242;
            font-weight: 500;
          }
        }
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
        className={itemClasses}>
          <a className="my-courses-item-title" onClick={onClick}>
              <h3 className="name">{offering.title}</h3>
              <div className="preview-belt">
                {previewMessage()}
              </div>
          </a>
      </div>
      <Dropdown className="my-courses-item-actions" data-appearance={offering.appearance_code}>
        <Dropdown.Toggle variant="ox">
        <Icon type="ellipsis-v"/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Course Settings</Dropdown.Item>
            <Dropdown.Item>Move Preview to Resources</Dropdown.Item>
          </Dropdown.Menu>
      </Dropdown>
  </StyledPreviewCourse>
  )
}

export default withRouter(CoursePreview)