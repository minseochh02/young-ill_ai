export const exportToCSV = (data, filename, headers = null) => {
    if (!data || !data.length) {
        alert("내보낼 데이터가 없습니다.");
        return;
    }

    // 1. Determine Headers
    const keys = headers ? Object.keys(headers) : Object.keys(data[0]);
    const headerLabels = headers ? Object.values(headers) : keys;

    // 2. Convert Data to CSV
    const csvContent = [
        headerLabels.join(','), // Header row
        ...data.map(row =>
            keys.map(key => {
                let cell = row[key] === null || row[key] === undefined ? '' : row[key];
                cell = String(cell).replace(/"/g, '""'); // Escape double quotes
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`; // Enclose in quotes if contains comma, newline or quotes
                }
                return cell;
            }).join(',')
        )
    ].join('\n');

    // 3. Create Blob with BOM for Korean support
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 4. Trigger Download
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
