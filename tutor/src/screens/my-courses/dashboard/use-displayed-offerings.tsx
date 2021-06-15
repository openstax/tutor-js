import React, { useState, useEffect, useMemo } from 'react'
import { filter, includes, indexOf, findIndex, union } from 'lodash'
//import {  Course } from '../../../models'
import UiSettings from 'shared/model/ui-settings'
import { ID, Offering, currentCourses, CoursesMap, currentOfferings } from '../../../models'

type ReturnUseDisplayedOfferings = [ID[], React.Dispatch<React.SetStateAction<ID[]>>, Offering[], (offeringId: ID, flow?: string) => void]

export const useDisplayedOfferingsIds = (courses: CoursesMap = currentCourses) => {
    const defaultOfferingIds = currentOfferings.array.filter(o => courses.array.find(c => c.offering_id == o.id)).map(fo => fo.id)
    const selectedIds = UiSettings.get('displayedOfferingIds') || []
    return union(selectedIds, defaultOfferingIds)
}

const useDisplayedOfferings = () : ReturnUseDisplayedOfferings => {
    // getting all the data: offerings and courses
    const courses = currentCourses
    const offerings = currentOfferings.array

    const [displayedOfferingIds, setDisplayedOfferingIds] = useState<ID[]>(
        useDisplayedOfferingsIds(courses)
    )

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

    return [displayedOfferingIds, setDisplayedOfferingIds, displayedOfferings, swapOffering]
}

export default useDisplayedOfferings
