import exportsToPassOn from './index';
const mixinsNames = ['ChapterSectionMixin', 'GetPositionMixin', 'ResizeListenerMixin'];

const componentsToExport = _.omit(exportsToPassOn, mixinsNames);
const mixins = _.pick(exportsToPassOn, mixinsNames);

const wrapComponent = component =>
    (DOMNode, props) => React.render(React.createElement(component, props), DOMNode)
;

const wrappedExports = _.mapObject(componentsToExport, wrapComponent);

export default _.extend({}, wrappedExports, mixins);
