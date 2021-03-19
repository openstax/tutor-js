interface UiSettings {
    get(prop: string, id?: string | number): any
    set(prop: string, value: any): void
}
declare var uis: UiSettings;

declare module 'shared/model/ui-settings' {
    export = uis
}

type interpolate = (s: string, params: any) => string

declare var inter: interpolate

declare module 'interpolate' {
    export = inter
}
