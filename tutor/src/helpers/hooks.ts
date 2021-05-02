import { currentCourses, currentOfferings } from '../models'

export const useAvailableOfferings = () => (
    currentOfferings.array.filter(o => o.is_available || o.is_preview_available || currentCourses.forOffering(o).any)
)
