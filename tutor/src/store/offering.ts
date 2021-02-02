import { createSlice, createEntityAdapter, ActionReducerMapBuilder, EntityState } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Offering } from './types'
import { getOfferings } from './api'

const offeringAdapter = createEntityAdapter<Offering>({
    sortComparer: (a, b) => a.id.localeCompare(b.id),
})

const initialState = offeringAdapter.getInitialState()
interface OfferingSlice { offerings: typeof initialState }

const selectors = offeringAdapter.getSelectors<OfferingSlice>(s => s.offerings)

const offeringSlice = createSlice({
    name: 'offerings',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<EntityState<Offering>>) => {
        builder.addCase(getOfferings.fulfilled, (state, { payload: offerings }) => {
            console.log(offerings)
            state.entities.push(offerings)
        })
        builder.addCase(getOfferings.rejected, (state, action) => {
            console.log(action)
        })
    },
})

// export const useAllOfferings = useSelector<OfferingSlice, Offering>((state) => selectors.selectEntities(state))

export const offeringsReducer = offeringSlice.reducer
