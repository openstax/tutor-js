import { createAction } from '@reduxjs/toolkit'
import { Course } from './types'

interface BoostrapPayload {
    courses: Course[]
}

export const bootstrap = createAction<BoostrapPayload>('bootstrap')
