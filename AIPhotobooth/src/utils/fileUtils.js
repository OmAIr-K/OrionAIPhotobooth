/**
 * Utility functions for file handling
 */

/**
 * Shows a save file dialog and saves the provided data
 * @param {Blob|string} data - The data to save (can be blob or base64 string)
 * @param {string} suggestedName - Default filename to suggest
 * @param {Object} options - Additional options for file saving
 * @returns {Promise<string>} The path where the file was saved
 */
export async function showSaveDialog(data, suggestedName, options = {}) {
    try {
        // Convert data to blob if it's a base64 string or data URL
        const blob = data instanceof Blob ? data : 
            await fetch(data).then(r => r.blob());

        // Configure file picker options
        const pickerOptions = {
            suggestedName,
            types: [{
                description: 'Image Files',
                accept: {
                    'image/*': ['.jpg', '.jpeg', '.png']
                },
                ...options
            }]
        };

        // Show save dialog
        const handle = await window.showSaveFilePicker(pickerOptions);

        // Write the file
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        return handle.name;
    } catch (error) {
        if (error.name === 'AbortError') {
            // User cancelled the save dialog
            return null;
        }
        throw error;
    }
}

/**
 * Generates a default filename based on style and timestamp
 * @param {string} style - The selected style name
 * @returns {string} Generated filename
 */
export function generateFilename(style) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `photo_${style}_${timestamp}.jpg`;
} 