import { r, makeUrlFunc } from 'shared/api/request'
import { ID } from 'shared/types'

const Definitions = {

    search:            r<any, { q: string, per_page: number, page: number }>('GET', 'exercises'),
    exercise:          r<{ uid: string }>('GET', 'exercises/{uid}'),
    saveNewDraft:      r('POST', 'exercises'),
    saveExistingDraft: r<{ number: ID }>('PUT', 'exercises/{number}@draft'),
    publish:           r<{uid: string}>('PUT', 'exercises/{uid}/publish'),
    books:             r<{archive_version?: string}>('GET', 'books'),
    book:              r<{uuid: string, version?: string, archive_version?: string}>('GET', 'books/{uuid}'),

}

export { Definitions }

const urlFor = makeUrlFunc(Definitions)

export default urlFor
