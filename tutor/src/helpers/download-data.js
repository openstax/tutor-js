export function downloadData(content, fileName, mimeType) {
    const a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType,
        }), fileName);
    } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType,
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
}

export function arrayToCSV(array) {
    let csvContent = '';
    array.forEach(function(infoArray, index) {
        const dataString = infoArray.map(
            elt => `"${elt ? elt.toString().replace('"', '\\"') : ''}"`
        ).join(',');
        csvContent += index < array.length ? dataString + '\n' : dataString;
    });
    return csvContent;
}
