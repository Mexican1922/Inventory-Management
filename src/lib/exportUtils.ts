/**
 * Converts an array of objects to CSV format and triggers a browser download.
 * @param data Array of objects to export
 * @param filename Name of the file (e.g., 'inventory-report.csv')
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Extract headers
  const headers = Object.keys(data[0]);

  // Build CSV string
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      // Escape commas and wrap in quotes if necessary
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
