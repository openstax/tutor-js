import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { bootstrap } from './bootstrap'
import { Offering, Course, ID } from './types'

const offeringAdapter = createEntityAdapter<Offering>({
    sortComparer: (a, b) => a.default_course_name.localeCompare(b.default_course_name),
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

export const useAvailableOfferings = ( courses: Course[] = []) => (
    useAllOfferings().filter(o => o.is_available || o.is_preview_available || courses.find(c => c.offering_id == o.id))
)

export const useOfferingForId = (offeringId: ID) => useSelector<OfferingSlice, Offering | undefined>(state => {
    return selectors.selectById(state, offeringId)
})

export const offeringsReducer = offeringSlice.reducer
