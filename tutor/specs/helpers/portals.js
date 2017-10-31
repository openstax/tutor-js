// "node" and "getMountNode" aren't documented
// if they ever break we could use:
//   _.last(document.querySelectorAll('.modal')));
export function portalContents(modal) {
  return modal.find('Portal').first().node.getMountNode();
}
