import React, { useState } from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import OXFancyLoader from 'shared/components/staxly-animation'
import Router from '../../../helpers/router'
import User from '../../../models/user'
import { createPreviewCourse, useLatestCoursePreview } from '../../../store/courses'
import { Offering } from '../../../store/types'
import { colors } from 'theme'
import { Icon } from 'shared'

const StyledPreviewCourse = styled.div`
    &&& {
        .my-courses-item-title {
            padding: 0;
            display: block;
            .name {
                padding-right: 3.2rem;
                overflow-wrap: break-word;
            }
            h3 {
                width: 20rem;
                padding: 1.5rem;
            }
            .preview-belt {
                background: white;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
                bottom: 40%;
            h5 {
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
            right: 10px;
            top: 40px;
            width: 18px;

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

                svg {
                    margin: 0;
                }
            }
        }
    }
`

interface CoursePreviewProps {
    offering: Offering
    className: string
    history: RouteComponentProps
    isPreviewInResource: boolean
    setIsPreviewInResource: (isPreviewInResource: boolean) => React.Dispatch<React.SetStateAction<boolean>>
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ offering, className, history, isPreviewInResource, setIsPreviewInResource }) => {
    const dispatch = useDispatch()
    const previewCourse = useLatestCoursePreview(offering.id)
    const [isCreating, setIsCreating] = useState(false)
    if (!offering.is_preview_available || !User.canCreateCourses) {
        return null
    }
    const goToPreviewCourse = (toSettings = false) => {
        const routePath = toSettings ? 'courseSettings' : 'dashboard';
        // course settings is tab = 1
        const queryPath = toSettings ? { query: { tab: 1 } } : {};
        if (previewCourse) {
            history.push(Router.makePathname(routePath, { courseId: previewCourse.id }, queryPath))
        } else {
            setIsCreating(true)
            dispatch(createPreviewCourse(offering))
                .then((result) => {
                    setIsCreating(false)
                    if (!result.error) {
                        window.location = Router.makePathname(routePath, { courseId: result.payload.id }, queryPath)
                    }
                })
        }
    }

    const previewMessage = () => {
        if (isCreating) {
            return <OXFancyLoader isLoading={true} />
        }
        return [
            <h5 key="title">Preview Course</h5>,
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
                data-test-id="preview-course-card"
                data-is-teacher={true}
                data-offering-id={offering.id}
                className={itemClasses}>
                <a
                    data-test-id="preview-course-item-title"
                    className="my-courses-item-title"
                    onClick={() => goToPreviewCourse()}
                >
                    <h4 className="name">{offering.title}</h4>
                    <div className="preview-belt">
                        {previewMessage()}
                    </div>
                </a>
            </div>
            <Dropdown className="my-courses-item-actions" data-appearance={offering.appearance_code}>
                <Dropdown.Toggle variant="ox">
                    <Icon type="ellipsis-v" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => goToPreviewCourse(true)}>Course Settings</Dropdown.Item>
                    <Dropdown.Item onClick={() => setIsPreviewInResource(!isPreviewInResource)}>
                        {`Move Preview to ${!isPreviewInResource ? 'resources' : 'current courses'}`}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </StyledPreviewCourse>
    )
}

export default withRouter(CoursePreview)
