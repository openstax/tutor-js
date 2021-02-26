import { createAction } from '@reduxjs/toolkit'
import { Course, Offering } from './types'

interface BoostrapPayload {
    courses: Course[]
    offerings: Offering[]
}

export const bootstrap = createAction<BoostrapPayload>('bootstrap')
