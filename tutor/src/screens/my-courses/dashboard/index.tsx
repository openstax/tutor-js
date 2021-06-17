import { React, useState, observer } from 'vendor'
import { Button } from 'react-bootstrap'
import { map, filter, every, sumBy } from 'lodash'
import styled from 'styled-components'
import { colors } from '../../../theme'
import { Icon } from 'shared'
import { ID } from '../../../models/types'
import { currentCourses, currentOfferings } from '../../../models'
import OfferingBlock from './offering-block'
import AddSubjectDropdown from './add-subject-dropdown'
import { DeleteOfferingModal, DeleteOfferingWarningModal } from './delete-offering-modal'
import useDisplayedOfferings from './use-displayed-offerings'

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
    }
    .offering-container {
        margin: 1.6rem 0 1.6rem 0;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding: 2.4rem 3.2rem 6.4rem;
        min-height: 40rem;
        position: relative;
        h3 {
            color: ${colors.neutral.std};
        }
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
        &.is-edit-mode {
            h3 {
                color: ${colors.neutral.darker};
            }
            .my-courses-item-wrapper , .my-courses-add-zone{
                opacity: 0.6;
                pointer-events: none;
            }
        }
    }
    .add-subject-dropdown {
        margin: 3.2rem 0;
        padding-bottom: 3.2rem;
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

export const MyCoursesDashboard = observer(() => {
    // const dispatch = useDispatch()
    // getting all the data: courses
    const courses = currentCourses

    const [deleteOfferingIdModal, setDeleteOfferingIdModal] = useState<ID | null>(null)
    const [displayedOfferingIds, setDisplayedOfferingIds, displayedOfferings, swapOffering] = useDisplayedOfferings()
    const [isEditMode, setIsEditMode] = useState<boolean>(false)

    // delete offering
    const deleteOffering = () => {
        if (!deleteOfferingIdModal) return
        const offering = currentOfferings.get(deleteOfferingIdModal)
        if (!offering) return
        Promise.all(courses.forOffering(offering).array.map(c => {
            return c.teachers.current?.drop() || Promise.resolve()
        })).then(() => {
            setDisplayedOfferingIds(displayedOfferingIds.filter(id => id != offering.id))
            setDeleteOfferingIdModal(null)
        })
    }

    const renderDeleteModal = () => {
        const offeringCourses = courses.array.filter(c => c.offering_id == deleteOfferingIdModal)
        const areAllPreviewCourses = every(offeringCourses, oc => oc.is_preview)
        const areAllNonPreviewCoursesWithoutStudents = every(filter(offeringCourses, c => String(c.term) !== 'preview'), oc => sumBy(oc?.periods, (p:any) => {
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

    const settingsButton = (
        <Button
            data-test-id="dashboard-settings-btn"
            variant="link"
            onClick={() => setIsEditMode(prevState => !prevState)}>
            <Icon type="cog" />{isEditMode ? 'Exit settings' : 'Manage subjects'}
        </Button>
    )

    return (
        <StyledMyCoursesDashboard>
            <h2 data-test-id="existing-teacher-screen">My Courses</h2>
            <div className="controls">
                {settingsButton}
            </div>
            {isEditMode &&
             <>
                 <AddSubjectDropdown
                     displayedOfferings={displayedOfferings}
                     setDisplayedOfferingIds={setDisplayedOfferingIds} />
             </>
            }
            {map(displayedOfferings, (o, i) =>
                <OfferingBlock
                    key={o.id}
                    offering={o}
                    courses={courses.forOffering(o)}
                    swapOffering={swapOffering}
                    tryDeleteOffering={setDeleteOfferingIdModal}
                    isEditMode={isEditMode}
                    isFirstBlock={i === 0}
                    isLastBlock={i === displayedOfferings.length - 1} />)
            }
            {renderDeleteModal()}
        </StyledMyCoursesDashboard>
    )
})

export default MyCoursesDashboard
