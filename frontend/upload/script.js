document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileName = file && file.name.endsWith('.log') ? file.name : 'Please select a .log file';
    document.getElementById('fileName').textContent = fileName;
    document.getElementById('status').textContent = '';
    document.getElementById('status').classList.remove('error', 'success');
    toggleSubmitButton(file);
});

function toggleSubmitButton(file) {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = !file || !file.name.endsWith('.log');
}

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (!fileInput.files.length || !fileInput.files[0].name.endsWith('.log')) {
        status.textContent = 'Please select a valid .log file.';
        status.classList.add('error');
        return;
    }

    const formData = new FormData();
    formData.append('logFile', fileInput.files[0]);

    submitButton.disabled = true;
    buttonText.textContent = 'Uploading...';
    loadingSpinner.classList.remove('hidden');
    status.textContent = 'Uploading...';
    status.classList.add('uploading');

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            status.textContent = result.message || 'File uploaded successfully and data saved in database!';
            status.classList.remove('uploading');
            status.classList.add('success');
            fileInput.value = '';
            document.getElementById('fileName').textContent = 'Drag and drop or click to select a .log file';
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        status.classList.remove('uploading');
        status.classList.add('error');
    } finally {
        submitButton.disabled = false;
        buttonText.textContent = 'Upload File';
        loadingSpinner.classList.add('hidden');
    }
});

// Drag and drop support
const dropArea = document.querySelector('.file-label');
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#3b82f6';
    dropArea.style.backgroundColor = '#f8fafc';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#ccc';
    dropArea.style.backgroundColor = 'transparent';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#ccc';
    dropArea.style.backgroundColor = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.log')) {
        document.getElementById('fileInput').files = e.dataTransfer.files;
        document.getElementById('fileName').textContent = file.name;
        toggleSubmitButton(file);
    } else {
        document.getElementById('fileName').textContent = 'Please select a .log file';
        document.getElementById('status').textContent = 'Only .log files are allowed.';
        document.getElementById('status').classList.add('error');
    }
});