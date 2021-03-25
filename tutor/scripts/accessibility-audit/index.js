const TestServer = require('../test-server');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { set, differenceBy, max, values, getOr, filter, flatten, mean, get } = require('lodash/fp');
const { write } = require('lighthouse/lighthouse-cli/printer');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const { URL } = require('url');

const diffFile = argv.diff && path.resolve(process.cwd(), argv.diff);
if (argv.diff && !fs.existsSync(diffFile)){
    console.error('diff file does not exist');
    process.exit(1);
}

const otherResults = argv.diff ? JSON.parse(fs.readFileSync(diffFile)) : '';
if (argv.diff && !otherResults) {
    console.error('diff file is not valid');
    process.exit(1);
}

const jsonFile = argv.json && path.resolve(process.cwd(), argv.json);
if (argv.json) {
    const jsonOutDir = path.dirname(jsonFile);
    if (!fs.existsSync(jsonOutDir)){
        fs.mkdirSync(jsonOutDir);
    }
}

const htmlOutDir = argv.html && path.resolve(process.cwd(), argv.html);
if (argv.html) {
    if (!fs.existsSync(htmlOutDir)){
        fs.mkdirSync(htmlOutDir);
    }
}

const reportOutFile = argv.report && path.resolve(process.cwd(), argv.report);
if (argv.report) {
    const reportOutDir = path.dirname(reportOutFile);
    if (!fs.existsSync(reportOutDir)){
        fs.mkdirSync(reportOutDir);
    }
}

const cache = argv.useCache && argv.json && fs.existsSync(jsonFile) && JSON.parse(fs.readFileSync(jsonFile));

const urls = [
    '/dashboard',
    '/course/6',
];

const chromeFlags = ['--headless', '--no-sandbox'];
const onlyCategories = ['accessibility'];

const server = new TestServer({ role: 'teacher' });
const baseUrl = server.url;

if (!cache) {
    server.boot()
        .then(runAudit)
        .then(server.halt.bind(server))
    ;
} else {
    runAudit();
}

async function runAudit() {
    const results = [];

    if (cache) {
        results.push(...cache);
    } else {
        for (const url of urls) {
            const chrome = await chromeLauncher.launch({ chromeFlags });
            const { port } = chrome;
            const auditUrl = url => lighthouse(baseUrl + url, { onlyCategories, chromeFlags, port });
            const result = await auditUrl(url);
            try {
                results.push(set('lhr.relativeUrl', url, result));
            } catch (e) {
                console.error(e);
            }

            await chrome.kill();
        }
    }

    if (argv.json) {
        fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));
    }

    if (argv.report) {
        const stats = getStats(results);
        const tableStats = stats => [stats.formattedScore, stats.passingAudits, stats.failingAudits, stats.notApplicableAudits];
        const rowHeaders = ['score', 'passing', 'failing', 'na'];

        const summary = () => {
            const columns = printColumns([
                rowHeaders,
                tableStats(stats),
            ]);

            return `\`\`\`\n${columns}\n\`\`\`\n`;
        };
        const diffSummary = () => {
            const otherStats = getStats(otherResults);
            const ourTableStats = tableStats(stats);
            const otherTableStats = tableStats(otherStats);
            const { indicators, deltas } = diff(
                ourTableStats,
                otherTableStats,
                {
                    reverseIndicators: [2],
                    ignoreIndicators: [3],
                },
            );

            const columns = printColumns([
                ['', ...indicators],
                ['', ...rowHeaders],
                [argv.summaryLabel || 'current', ...ourTableStats],
                [argv.diffLabel || 'other', ...otherTableStats],
                ['+/-', ...deltas],
            ]);
            return `\`\`\`diff\n${columns}\n\`\`\`\n`;
        };

        const diffFailing = argv.diff ? differenceBy('id', failingAudits(results), failingAudits(otherResults)) : [];
        const tips = argv.tips && !isNaN(argv.tips) ? failingAudits(results).slice(0, argv.tips) : [];

        const report = `
## Accessibility Audit Report
${argv.diff ? diffSummary() : summary()}
${diffFailing.length > 0 ? `
### These audits are now failing
${diffFailing.map(printAudit).join('\n')}
` : ''}
${tips.length > 0 ? `
### Fixing these audits would improve the score
${tips.map(printAudit).join('\n')}
` : ''}
    `.trim();

        fs.writeFileSync(reportOutFile, report);
    }

    if (argv.html) {
        await Promise.all(results.map(({ lhr }) => {
            const fileName = path.join(htmlOutDir, new URL(lhr.requestedUrl).pathname.replace(/\//g, '_').replace(/^_/, ''));
            return write(reportGenerator.generateReportHtml(lhr), 'html', fileName + '.html');
        }));
    }
}

function printColumns(cols) {
    const margin = '  ';

    return cols.reduce((rows, col) => {
        const len = max(col.map(get('length')));
        const numeric = col.reduce((result, cell) => !isNaN(cell) || result, false);
        const pad = cell => (numeric ? String(cell).padStart(len) : String(cell).padEnd(len));
        return col.map((cell, i) => getOr('', i, rows) + pad(cell) + margin);
    }, [])
        .join('\n');
}

function getStats(results) {
    const allAudits = flatten(results.map(get('lhr.audits')).map(values));
    const averageScore = mean(results.map(get('lhr.categories.accessibility.score')));

    return {
        averageScore, allAudits,
        passingAudits: filter({ score: 1 }, allAudits).length,
        failingAudits: filter({ score: 0 }, allAudits).length,
        notApplicableAudits: filter({ score: null }, allAudits).length,
        numAudits: allAudits.length,
        formattedScore: (averageScore * 100).toFixed(0),
    };
}

function diff(column1, column2, config = {}) {
    const ignoreIndicator = i => getOr([], 'ignoreIndicators', config).indexOf(i) > -1;
    const reverseIndicator = i => getOr([], 'reverseIndicators', config).indexOf(i) > -1;
    const rawDeltas = column1.map((cell, i) => parseInt(cell, 10) - getOr(0, i, column2));
    const deltas = rawDeltas.map((delta, i) => {
        if (delta > 0) {
            return '+' + delta;
        }
        if (delta < 0) {
            return String(delta);
        }
        return '';
    });
    const indicators = rawDeltas.map((delta, i) => {
        if (ignoreIndicator(i)) {
            return '';
        }
        if ((!reverseIndicator(i) && delta < 0) || (reverseIndicator(i) && delta > 0)) {
            return '-';
        }
        if ((!reverseIndicator(i) && delta > 0) || (reverseIndicator(i) && delta < 0)) {
            return '+';
        }
        return '';
    });

    return { deltas, indicators };
}

function printAudit(audit) {
    return `**${audit.title}** (page: ${audit.url})
${audit.description}

`;
}

function failingAudits(results) {
    return flatten(results.map(({ lhr }) => values(lhr.audits).filter(audit => audit.score === 0).map(audit => ({
        id: `${lhr.relativeUrl}-${audit.id}`,
        url: lhr.relativeUrl,
        title: audit.title,
        description: audit.description,
    }))));
}
