import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Offering } from './types'
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
    extraReducers: (builder) => {
        builder.addCase(getOfferings.fulfilled, (state, action) => {
            offeringAdapter.setAll(state, action.payload.items)
        })
    },
})

export const useAllOfferings : Offering[] = () => useSelector<OfferingSlice>(state => {
    return selectors.selectAll(state)
})

export const offeringsReducer = offeringSlice.reducer
