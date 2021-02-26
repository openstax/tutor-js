import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { map, groupBy, some } from 'lodash'
import TutorDropdown from '../../../components/dropdown'

import { Offering, ID } from '../../../store/types'

interface AddSubjectsDropdownProps {
    allOfferings: Offering[]
    displayedOfferings: Offering[]
    setDisplayedOfferingIds: React.Dispatch<React.SetStateAction<ID[]>>
}

const AddSubjectsDropdown: React.FC<AddSubjectsDropdownProps> = ({ allOfferings, displayedOfferings, setDisplayedOfferingIds }) => {
    const offeringsBySubject = groupBy(allOfferings, o => o.subject)
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
                            onSelect={() => setDisplayedOfferingIds(prevState => [...prevState, offering.id])}
                            disabled={isDisplayed}>
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
