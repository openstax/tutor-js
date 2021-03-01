interface UiSettings {
    get(prop: string): any
}
declare var uis: UiSettings;

declare module 'shared/model/ui-settings' {
    export = uis
}
