export type ID = string | number

export interface JSON {
    readonly [text: string]: JSON | JSON[] | string | number | boolean
}
