# Accessibility Audit

## Basic Usage

runs the audit and prints a basic report summary to the specified file path

```bash
node tutor/scripts/accessibility-audit --report=report.md
```

## Save Raw Report

runs the audit and saves raw report data to the specified file path. the json can be used later
as a cache file or to generate a diff report.

```bash
node tutor/scripts/accessibility-audit --json=report.json
```

## Cache

doesn't actually run the audit, loads the report data from a json file.

```bash
node tutor/scripts/accessibility-audit --json=report.json --use-cache
```

## Tips

adds a number of descriptions for failed audits to the report output.

```bash
node tutor/scripts/accessibility-audit --report=report.md --tips=7
```

## Diff

compare two reports.

```bash
node tutor/scripts/accessibility-audit --report=report.md --diff=otherreport.json
# with labels
node tutor/scripts/accessibility-audit --report=report.md --diff=otherreport.json --summary-label="this report" --diff-label="other report"
```
