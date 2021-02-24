export default {
    getTopPosition(el) {
        if (!el) { return 0; }
        return el.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    },
};
