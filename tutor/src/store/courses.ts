import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { endsWith, get, first, sortBy, find, capitalize, sumBy, filter } from 'lodash'
import { Course, Role } from './types'
import { updateCourse, createPreviewCourse } from './api'
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
        setCurrentRole(state, { payload: { id, roleId } }: PayloadAction<{ id: string, roleId: string }>) {
            const course = state.entities[id]
            if (course) { course.current_role_id = roleId }
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
export const useHasAnyCourses = () => useSelector<CourseSlice, boolean>((state) => selectors.selectTotal(state) > 0)

export const useNameCleaned = (courseId: string) => useSelector<CourseSlice, string | undefined>(state => {
    const course = selectors.selectById(state, courseId)
    const previewSuffix = ' Preview';
    if (course?.is_preview && endsWith(course?.name, previewSuffix)) {
      return course.name.slice(0, -previewSuffix.length);
    } else {
      return course?.name;
    }
})

export const useBookName = (courseId: string) => useSelector<CourseSlice, string>(state => {
    const course = selectors.selectById(state, courseId)
    return get(CourseInformation.information(course?.appearance_code), 'title', '');
})

export const usePrimaryRole = (courseId: string) => useSelector<CourseSlice, Role | undefined>(state => {
    const course = selectors.selectById(state, courseId)
    return first(sortBy(course?.roles, r => -1 * ROLE_PRIORITY.indexOf(r.type)));
})

export const useCurrentRole = (courseId: string) => useSelector<CourseSlice, Role | undefined>(state => {
    const course = selectors.selectById(state, courseId)
    if (course?.current_role_id) {
      return find(course.roles, { id: course.current_role_id });
    }
    return usePrimaryRole(courseId);
})

export const useTermFull = (courseId: string, doCapitalize = true) => useSelector<CourseSlice, string | null>(state => {
    const course = selectors.selectById(state, courseId)
    if(course) {
        const term = doCapitalize ? capitalize(course.term) : course.term
        return `${term} ${course.year}`
    }
    return null
})

export const useNumberOfStudents = (courseId: string) => useSelector<CourseSlice, number>(state => {
    const course = selectors.selectById(state, courseId)
    return sumBy(course?.periods, p => p.num_enrolled_students)
})

export const useCoursesByOfferingId = (offeringId : string, includePreview = false) => useSelector<CourseSlice, Course[]>(state => {
    const courses = selectors.selectAll(state)
    const coursesByOfferingId = filter(courses, c => c.offering_id === offeringId)
    if(!includePreview) {
        return filter(coursesByOfferingId, co => String(co.term) != 'preview')
    }
    return coursesByOfferingId
})

export { createPreviewCourse, updateCourse, selectors }
export const coursesReducer = coursesSlice.reducer

// exports must be named and you cannot export all actions at once
// https://stackoverflow.com/questions/29844074/es6-export-all-values-from-object
export const { rename, setCurrentRole } = coursesSlice.actions
