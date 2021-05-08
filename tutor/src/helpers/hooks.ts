import { currentCourses, currentOfferings, CoursesMap } from '../models'

export const useAvailableOfferings = (courses: CoursesMap = currentCourses) => (
    currentOfferings.array.filter(o => o.is_available || o.is_preview_available || courses.forOffering(o).any)
)
