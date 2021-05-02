
type interpolate = (s: string, params: any) => string

declare var inter: interpolate

declare module 'interpolate' {
    export = inter
}

type MDRegex = (r: RegExp, cb:()=> string) => MarkdownIt.PluginSimple
declare var mdr: MDRegex
declare module 'markdown-it-regexp' {
    export = mdr
}
