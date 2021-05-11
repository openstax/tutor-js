import { currentCourses, currentOfferings, CoursesMap, ID } from '../models'
import { useParams } from 'react-router-dom';

export const useAvailableOfferings = (courses: CoursesMap = currentCourses) => (
    currentOfferings.array.filter(o => o.is_available || o.is_preview_available || courses.forOffering(o).any)
)

export const useCourse = (courseId: ID = useParams<{ courseId: string }>().courseId) => currentCourses.get(courseId)
