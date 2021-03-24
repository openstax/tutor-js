import { r } from 'shared/api/request'
import { ID } from 'shared/types'

const Api = {

    search:            r<{}, { q: string, per_page: number, page: number }>('GET', 'exercises'),
    exercise:          r<{ uid: string }>('GET', 'exercises/{uid}'),
    saveNewDraft:      r('POST', 'exercises'),
    saveExistingDraft: r<{ number: ID }>('PUT', 'exercises/{number}@draft'),
    publish:           r<{uid: string}>('PUT', 'exercises/{uid}/publish'),

}

export default Api
