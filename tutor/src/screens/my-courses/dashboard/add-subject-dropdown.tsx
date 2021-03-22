import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { map, groupBy, some } from 'lodash'
import TutorDropdown from '../../../components/dropdown'
import { useAllCourses } from '../../../store/courses'
import { useAvailableOfferings } from '../../../store/offering'
import { Offering, ID } from '../../../store/types'
import Scroller from '../../../helpers/scroll-to'

interface AddSubjectsDropdownProps {
    displayedOfferings: Offering[]
    setDisplayedOfferingIds: React.Dispatch<React.SetStateAction<ID[]>>
}

const scroller = new Scroller()

const AddSubjectsDropdown: React.FC<AddSubjectsDropdownProps> = ({ displayedOfferings, setDisplayedOfferingIds }) => {
    const courses = useAllCourses()
    const allOfferings = useAvailableOfferings(courses)
    const offeringsBySubject = groupBy(allOfferings, o => o.subject)

    const onSelectOffering = (offeringId: ID) => {
        // adding the subject block at the top
        setDisplayedOfferingIds(prevState => [offeringId, ...prevState])
        // then scroll to the top to see the new offering block
        scroller.scrollToTop({ deferred: true })
    }

    const subjects = map(offeringsBySubject, (offerings, subject) => {
        return (
            <div key={subject} className="subject-offering-items-container">
                <Dropdown.Item
                    className="subject-item"
                    eventKey={subject}
                    disabled>
                    {subject || 'Subjects'}
                </Dropdown.Item>

                {map(offerings, offering => {
                    const isDisplayed = some(displayedOfferings, dio => dio.id === offering.id)
                    return (
                        <Dropdown.Item
                            className="offering-item"
                            key={offering.id}
                            eventKey={offering.title}
                            onSelect={() => onSelectOffering(offering.id)}
                            disabled={isDisplayed}
                        >
                            {offering.title}
                        </Dropdown.Item>
                    )
                }
                )}
            </div>
        )
    });

    return (
        <div className="add-subject-dropdown">
            <h3>Add subject</h3>
            <TutorDropdown
                toggleName="Select a subject you will be teaching"
                dropdownItems={subjects}
            />
        </div>
    )
}

export default AddSubjectsDropdown