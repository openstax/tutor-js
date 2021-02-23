import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Course } from './types'
import { updateCourse } from './api'
import { bootstrap } from './bootstrap'

const courseAdapter = createEntityAdapter<Course>({
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const initialState = courseAdapter.getInitialState()
interface CourseSlice { courses: typeof initialState }

const selectors = courseAdapter.getSelectors<CourseSlice>(s => s.courses)


const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        rename(state, { payload: { id, name } }: PayloadAction<{ id: string, name: string }>) {
            const course = state.entities[id]
            if (course) { course.name = name }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateCourse.fulfilled, (state, { payload: course }) => {
            state.ids[course.id] = course
        })
        builder.addCase(bootstrap, (state, action) => {
            courseAdapter.setAll(state, action.payload.courses)
        })
    },
})

// some hooks
export const useHasAnyCourses = () => useSelector<CourseSlice>((state) => selectors.selectTotal(state) > 0)

export { updateCourse, selectors }
export const coursesReducer = coursesSlice.reducer

// exports must be named and you cannot export all actions at once
// https://stackoverflow.com/questions/29844074/es6-export-all-values-from-object
export const { rename } = coursesSlice.actions
