import { get, map, union, reduce } from 'lodash';
import { observable } from 'shared/model'
import { DomHandler, DomUtils, Parser } from 'htmlparser2'
import { Node, Element } from 'domhandler';

// this appears to be built in some non-standard way that
// does not work with 'import'

const LINKS_BEGIN = ['#'];
const LINKS_CONTAIN = ['cnx.org/contents/'];

const MEDIA_LINK_EXCLUDES = [
    '.nav',
    '.view-reference-guide',
    '[data-type=footnote-number]',
    '[data-type=footnote-ref]',
    '[data-targeted=media]',
    '[href*=\'/\']',
    '[href=\'#\']',
];

const buildAllowed = function(linksBegin: string[], linksContain: string[]) {
    const beginSelectors = map(linksBegin, linkString => `a[href^='${linkString}']`);

    const containSelectors = map(linksContain, linkString => `a[href*='${linkString}']`);

    return union(beginSelectors, containSelectors);
};


class MediaDOM {
    name: string
    html: string
    constructor(name: string, html: string) {
        this.name = name
        this.html = html
    }
}

export class Media {

    media = observable.map<string, MediaDOM>()

    _parseHandler?: DomHandler
    get parseHandler() {
        return this._parseHandler || ( this._parseHandler = new DomHandler(this._parseHandlerFn as any) )
    }

    _parseHandlerFn = (_error:Error | null, dom: Node|Node[]) => {
        const links = DomUtils.getElementsByTagName('a', dom as any, true);
        return links.forEach(link => this._parseAndLoad(dom, link as any));
    }

    parse(htmlString: string) {
        return this.parser.parseComplete(htmlString);
    }

    get(id: string) {
        return this.media.get(id)
    }

    reset() {
        this.media.clear()
        delete this._parseHandler;
        delete this._parser;
    }

    _parser?: Parser
    get parser(): Parser {
        return this._parser || (this._parser = new Parser(this.parseHandler));
    }

    _parseAndLoad(dom: Node | Node[], link: Element) {
        if (link.attribs.href.search('#') === 0) {
            const id = link.attribs.href.replace('#', '');
            const idDOM = DomUtils.getElementById(id, dom as any);
            if (idDOM) {
                const outerEl = get(idDOM, 'parent.attribs.class') === 'os-figure' ? idDOM.parent : idDOM;
                if (outerEl) {
                    this.media.set(id, new MediaDOM(idDOM.name, DomUtils.getOuterHTML(outerEl)))
                }
            }
        }
    }

    isLoaded(id: string) { return (this.get(id) != null); }

    getMediaIds() {
        return Array.from(this.media.keys())
    }

    getLinksContained() {
        return LINKS_CONTAIN;
    }

    getAllowed() {
        return buildAllowed(LINKS_BEGIN, LINKS_CONTAIN);
    }

    getExcluded() {
        return MEDIA_LINK_EXCLUDES;
    }

    getSelector() {
        const notMedias = reduce(MEDIA_LINK_EXCLUDES, (current, exclude) => `${current}:not(${exclude})`
            , '');

        return map(buildAllowed(LINKS_BEGIN, LINKS_CONTAIN), allowed => `${allowed}${notMedias}`).join(', ');
    }

}

export const currentMedia = new Media()

// exports: {
//     get(id) { return this._get(id); },
// },
