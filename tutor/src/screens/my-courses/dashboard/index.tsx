import React, { useState, useEffect, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { map, filter, includes, indexOf, findIndex, every, sumBy, find } from 'lodash'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { colors } from 'theme'
import { Icon } from 'shared'
import { ID } from '../../../store/types'
import UiSettings from 'shared/model/ui-settings'
import { dropCourseTeacher } from '../../../store/api'
import { useDisplayedCourseOfferingIds, useAllCourses } from '../../../store/courses'
import { useAvailableOfferings } from '../../../store/offering'
import OfferingBlock from './offering-block'
import AddSubjectDropdown from './addSubjectDropdown'
import { DeleteOfferingModal, DeleteOfferingWarningModal } from './delete-offering-modal'

const StyledMyCoursesDashboard = styled.div`
    background-color: white;
    padding: 3.8rem 1.6rem;
    h3 {
        font-weight: 700;
        font-size: 2.4rem;
        line-height: 3rem;
        color: ${colors.neutral.darker};
        margin-bottom: 1rem;
    }
    .controls {
        display: flex;
        justify-content: flex-end;
        &.bottom-controls {
            margin-top: 1.2rem;
        }
    }
    .offering-container {
        margin: 1.6rem 0 1.6rem 0;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding: 2.4rem 3.2rem 6.4rem;
        min-height: 40rem;
        .edit-mode-icons {
            float: right;
        }
        .tutor-tabs {
            .nav-tabs {
                li a {
                    padding: 1rem 3rem;
                }
            }
        }
        .my-courses-item {
            // Set to 0 so it does not show the entire logo of the book.
            &:before {
                height: 0;
            }
        }
        .course-cards {
            --gap: 3.2rem;
            display: inline-flex;
            flex-wrap: wrap;
            margin-left: calc(-1 * var(--gap));
            width: calc(100% + var(--gap));
            > div {
                margin: var(--gap) 0 0 var(--gap);
                width: 260px;
                margin-top: 0;
                > div {
                    &:hover {
                        box-shadow: 0 5px 15px rgb(0 0 0 / 30%);
                    }
                }
            }
            .no-courses-message {
                font-weight: 700;
                font-size: 1.8rem;
                color: ${colors.neutral.darker};
                margin: 7rem auto;
            }
        }
    }
    .add-subject-dropdown {
        margin-top: 3.2rem;
        padding-bottom: 8rem;
        border-bottom: 1px solid ${colors.neutral.pale};
        .dropdown-toggle {
            width: 35rem;
            font-size: 1.4rem;
            color: ${colors.neutral.thin};
        }
        .dropdown-menu {
            .subject-offering-items-container {
                &:not(:last-child) {
                    border-bottom: 1px solid ${colors.neutral.pale};
                }
                .subject-item {
                    color: ${colors.neutral.thin};
                    font-weight: 400;
                }
                .offering-item {
                    padding-left: 2rem;
                    &.disabled {
                        opacity: 0.4;
                    }
                }
            }
        }
    }
`

/**
 * Main component
 */

export const MyCoursesDashboard = () => {
    const dispatch = useDispatch()
    // getting all the data: offerings and courses
    const courses = useAllCourses()
    const offerings = useAvailableOfferings(courses)

    const [deleteOfferingIdModal, setDeleteOfferingIdModal] = useState<ID | null>(null)
    const [displayedOfferingIds, setDisplayedOfferingIds] = useState<ID[]>(
        useDisplayedCourseOfferingIds()
    )
    const [isEditMode, setIsEditMode] = useState<boolean>(false)

    // update the `displayedOfferingIds` if users adds/delete offerings
    useEffect(() => {
        UiSettings.set('displayedOfferingIds', [...displayedOfferingIds])
    }, [displayedOfferingIds])

    // re-compute the `displayedOfferings` if `displayedOfferingIds` is modified
    const displayedOfferings = useMemo(() => {
        const filteredOfferings = filter(offerings, o => includes(displayedOfferingIds, o.id))
        return filteredOfferings.sort((a, b) => {
            return indexOf(displayedOfferingIds, a.id) - indexOf(displayedOfferingIds, b.id)
        })
    }, [displayedOfferingIds, offerings])

    // move offerings block around
    const swapOffering = (offeringId: ID, flow = 'up') => {
        const tempDisplayedOfferingIds = [...displayedOfferingIds]
        const index = findIndex(tempDisplayedOfferingIds, id => id === offeringId)
        if (index >= 0) {
            const swapIndex = flow === 'up' ? index - 1 : index + 1;
            [tempDisplayedOfferingIds[index], tempDisplayedOfferingIds[swapIndex]] = [tempDisplayedOfferingIds[swapIndex], tempDisplayedOfferingIds[index]];
        }
        setDisplayedOfferingIds(tempDisplayedOfferingIds)
    }

    // delete offering
    const deleteOffering = () => {
        const tempDisplayedOfferingIds = [...displayedOfferingIds]
        const index = findIndex(tempDisplayedOfferingIds, id => id === deleteOfferingIdModal)
        if (index >= 0 && deleteOfferingIdModal) {
            const offeringCourses = filter(courses, c => c.offering_id === deleteOfferingIdModal && String(c.term) !== 'preview')
            Promise.all(map(offeringCourses, c => {
                const currentRole = find(c.roles, r => r.type === 'teacher')
                const currentTeacher = currentRole && find(c.teachers, t => t.role_id === currentRole.id);
                if(currentTeacher) {
                    dispatch(dropCourseTeacher(currentTeacher.id))
                } else {
                    Promise.resolve()
                }
            }))
                .then(() => {
                    tempDisplayedOfferingIds.splice(index, 1)
                    setDisplayedOfferingIds(tempDisplayedOfferingIds)
                    setDeleteOfferingIdModal(null)
                })
        }
    }

    const renderDeleteModal = () => {
        const offeringCourses = filter(courses, c => c.offering_id === deleteOfferingIdModal)
        const areAllPreviewCourses = every(offeringCourses, oc => oc.is_preview)
        const areAllNonPreviewCoursesWithoutStudents = every(filter(offeringCourses, c => String(c.term) !== 'preview'), oc => sumBy(oc?.periods, p => {
            return p.num_enrolled_students
        }) === 0)
        if (areAllPreviewCourses || areAllNonPreviewCoursesWithoutStudents) {
            return (
                <DeleteOfferingModal
                    show={Boolean(deleteOfferingIdModal)}
                    onHide={() => setDeleteOfferingIdModal(null)}
                    onDelete={() => deleteOffering()}
                />
            )
        }
        return (
            <DeleteOfferingWarningModal
                show={Boolean(deleteOfferingIdModal)}
                onHide={() => setDeleteOfferingIdModal(null)} />
        )
    }

    const settingsButton =
        <Button
            variant="link"
            onClick={() => setIsEditMode(prevState => !prevState)}>
            <Icon type="cog" />{isEditMode ? 'Exit settings' : 'Manage subjects'}
        </Button>

    return (
        <StyledMyCoursesDashboard>
            <h2 data-test-id="existing-teacher-screen">My Courses</h2>
            <div className="controls">
                {settingsButton}
            </div>
            { map(displayedOfferings, (o, i) =>
                <OfferingBlock
                    key={o.id}
                    offering={o}
                    courses={filter(courses, c => c.offering_id === o.id && String(c.term) !== 'preview')}
                    swapOffering={swapOffering}
                    tryDeleteOffering={setDeleteOfferingIdModal}
                    isEditMode={isEditMode}
                    isFirstBlock={i === 0}
                    isLastBlock={i === displayedOfferings.length - 1} />)
            }
            { isEditMode &&
                <>
                    <AddSubjectDropdown
                        allOfferings={offerings}
                        displayedOfferings={displayedOfferings}
                        setDisplayedOfferingIds={setDisplayedOfferingIds} />
                    <div className="controls bottom-controls">
                        {settingsButton}
                    </div>
                </>
            }
            {renderDeleteModal()}
        </StyledMyCoursesDashboard>
    )
}

export default MyCoursesDashboard
