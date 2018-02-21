import {EXPECTED_COLOR, matcherHint, RECEIVED_COLOR} from 'jest-matcher-utils';
const path = require('path');
const fs = require('fs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5; // 5 minutes<your_timeout>

expect.extend({

  toMatchPreviousPage(source) {
    if ('MODIFIED' === source.status) {
      if ('all' === this.snapshotState._updateSnapshot) {
        fs.renameSync(source.testFile, source.file);
        this.snapshotState.updated += 1;
        return { pass: true, message: () => 'snapshot was updated' };
      } else {
        this.snapshotState.unmatched += 1;
        return { pass: false, message: () => `Image did not match previous (${RECEIVED_COLOR(source.mismatchCount)} mismatched). Differences are highlighted in ${EXPECTED_COLOR(source.differences)}` };

      }
    } else if ('NEW' === source.status) {
      this.snapshotState.added += 1;
      return { pass: true, message: () => 'new snapshot was written' };
    }
    this.snapshotState.matched += 1;
    return { pass: true, message: () => 'snapshot matched' };
  },

});
