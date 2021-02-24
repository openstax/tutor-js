export default function getRangeRect(win, range) {
    const rect = range.getBoundingClientRect();
    const wLeft = win.pageXOffset;
    const wTop = win.pageYOffset;
    return {
        bottom: rect.bottom + wTop,
        top: rect.top + wTop,
        left: rect.left + wLeft,
        right: rect.right + wLeft,
    };
}
