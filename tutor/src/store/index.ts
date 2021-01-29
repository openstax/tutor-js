import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { coursesReducer } from './courses'
import { bootstrap } from './bootstrap'

const appReducers = combineReducers({
    courses: coursesReducer,
})

export type RootState = ReturnType<typeof appReducers>

export { bootstrap }


const store = configureStore({
    reducer: appReducers,

})

export type AppDispatch = typeof store.dispatch

export default store
