import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { Offering } from './types'
import { getOfferings } from './api'

const offeringAdapter = createEntityAdapter<Offering>({
    sortComparer: (a, b) => a.default_course_name.localeCompare(b.default_course_name),
})

const initialState = offeringAdapter.getInitialState()

const offeringSlice = createSlice({
    name: 'offerings',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getOfferings.fulfilled, (state, action) => {
            offeringAdapter.setAll(state, action.payload.items)
        })
    },
})

export const offeringsReducer = offeringSlice.reducer
