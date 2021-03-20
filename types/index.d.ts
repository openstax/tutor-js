
type interpolate = (s: string, params: any) => string

declare var inter: interpolate

declare module 'interpolate' {
    export = inter
}
