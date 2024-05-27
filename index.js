const API_KEY = 'AIzaSyDE_jHlwUTO62TvAZqVPIgyOd0B0J8sLmo';
const SPREADSHEET_ID = '1-ceK_eeykNUdE_oHWzFq-jFG6XVR-t5EL-7-QcAVjns';
const RANGE = 'Sheet1!A1:D10'; // Change to your range

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

function displayData(data) {
    const dataDiv = document.getElementById('data');
    dataDiv.innerHTML = '';

    data.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.textContent = row.join(', ');
        dataDiv.appendChild(rowDiv);
    });
}

async function updateData() {
    try {
        const data = await fetchData();
        console.log(data);
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initial data fetch
updateData();

// Fetch data every 30 seconds
setInterval(updateData, 30000);
