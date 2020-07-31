const UNWORKED = '---';
const FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export { UNWORKED };

export default {
  // Converts to negative number so the rounding will occur towards zero
  formatLatePenalty(num) {
    return this.formatDecimal(Math.round(-parseFloat(num) * 100) / 100);
  },

  formatDecimal(dec) {
    return FORMATTER.format(dec);
  },

  formatPoints(points) {
    if (points === 0.0) { return '0'; }
    return this.formatDecimal(points);
  },

  asPercent(num) {
    // Let the formatter round before passing, otherwise
    // significant values will be lost.
    return Math.round(this.formatDecimal(num * 100));
  },
};
