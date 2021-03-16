import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { union } from 'lodash'
import { bootstrap } from './bootstrap'
import { Offering, Course, ID } from './types'
import UiSettings from 'shared/model/ui-settings'

const offeringAdapter = createEntityAdapter<Offering>({
    sortComparer: (a, b) => {
        //send an offering that is not available to the bottom of the list
        if(!a.is_available && !a.is_preview_available) return 1
        return b.number.localeCompare(a.number)
    },
})

const initialState = offeringAdapter.getInitialState()
interface OfferingSlice { offerings: typeof initialState }

const selectors = offeringAdapter.getSelectors<OfferingSlice>(s => s.offerings)

const offeringSlice = createSlice({
    name: 'offerings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(bootstrap, (state, action) => {
            offeringAdapter.setAll(state, action.payload.offerings)
        })
    },
})

export const useAllOfferings = () => useSelector<OfferingSlice, Offering[]>(state => {
    return selectors.selectAll(state)
})

export const useAvailableOfferings = (courses: Course[] = []) => (
    useAllOfferings().filter(o => o.is_available || o.is_preview_available || courses.find(c => c.offering_id == o.id))
)

export const useOfferingForId = (offeringId: ID) => useSelector<OfferingSlice, Offering | undefined>(state => {
    return selectors.selectById(state, offeringId)
})

export const useDisplayedOfferingsIds = (courses: Course[] = []) => {
    const defaultOfferingIds = useAllOfferings().filter(o => courses.find(c => c.offering_id == o.id)).map(fo => fo.id)
    const selectedIds = UiSettings.get('displayedOfferingIds') || []
    return union(selectedIds, defaultOfferingIds)
}

export const offeringsReducer = offeringSlice.reducer
