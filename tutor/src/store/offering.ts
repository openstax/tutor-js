import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { bootstrap } from './bootstrap'
import { Offering, ID } from './types'
import { getOfferings } from './api'

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
        builder.addCase(getOfferings.fulfilled, (state, action) => {
            offeringAdapter.setAll(state, action.payload.items)
        }),
        builder.addCase(bootstrap, (state, action) => {
            console.log(state)
            console.log(action)
            offeringAdapter.setAll(state, action.payload.offerings)
        })
    },
})

export const useAllOfferings = () => useSelector<OfferingSlice, Offering[]>(state => {
    return selectors.selectAll(state)
})

export const useOfferingForId = (offeringId: ID) => useSelector<OfferingSlice, Offering | undefined>(state => {
    return selectors.selectById(state, offeringId)
})

export const offeringsReducer = offeringSlice.reducer
