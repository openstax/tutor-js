import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { endsWith, get, first, sortBy, find, capitalize } from 'lodash'
import { Course } from './types'
import { updateCourse } from './api'
import { bootstrap } from './bootstrap'
import CourseInformation from '../models/course/information'

const ROLE_PRIORITY = [ 'guest', 'student', 'teacher', 'admin' ];

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

export const useNameCleaned = (id) => useSelector<CourseSlice>(state => {
    const course = selectors.selectById(state, id)
    const previewSuffix = ' Preview';
    if (course.is_preview && endsWith(course.name, previewSuffix)) {
      return course.name.slice(0, -previewSuffix.length);
    } else {
      return course.name;
    }
})

export const useBookName = (id) => useSelector<CourseSlice>(state => {
    const course = selectors.selectById(state, id)
    get(CourseInformation.information(course.appearance_code), 'title', '');
})

export const usePrimaryRole = (id) => useSelector<CourseSlice>(state => {
    const course = selectors.selectById(state, id)
    return first(sortBy(course.roles, r => -1 * ROLE_PRIORITY.indexOf(r.type)));
})

export const useCurrentRole = (id) => useSelector<CourseSlice>(state => {
    const course = selectors.selectById(state, id)
    if (course.current_role_id) {
      return find(course.roles, { id: course.current_role_id });
    }
    return usePrimaryRole(id);
})

export const useTermFull = (id, doCapitalize = true) => useSelector<CourseSlice>(state => {
    const course = selectors.selectById(state, id)
    const term = doCapitalize ? capitalize(course.term) : course.term
    return `${term} ${course.year}`
})

export { updateCourse, selectors }
export const coursesReducer = coursesSlice.reducer

// exports must be named and you cannot export all actions at once
// https://stackoverflow.com/questions/29844074/es6-export-all-values-from-object
export const { rename } = coursesSlice.actions
