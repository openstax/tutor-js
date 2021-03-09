interface UiSettings {
    get(prop: string): any
    set(prop: string, value: any): void
}
declare var uis: UiSettings;

declare module 'shared/model/ui-settings' {
    export = uis
}
