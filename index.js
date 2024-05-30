const API_KEY = 'AIzaSyDE_jHlwUTO62TvAZqVPIgyOd0B0J8sLmo';
const SPREADSHEET_ID = '1-ceK_eeykNUdE_oHWzFq-jFG6XVR-t5EL-7-QcAVjns';
const RANGE = 'Sheet1!A1:D10'; // Change to your range

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

function updateBoothData(data) {
    const boothsDiv = document.getElementById('booths').children;

    // Assuming data is an array of arrays, where the first element is the booth number and the second element is the booth name
    data.forEach(row => {
        const boothNumber = row[0];
        const boothName = row[1];
        
        // Find the booth div by id
        const boothDiv = document.getElementById(`booth${boothNumber}`);
        if (boothDiv) {
            // Update the data-name attribute with the booth name
            boothDiv.setAttribute('data-name', boothName);
        }
    });
}

async function updateData() {
    try {
        const data = await fetchData();
        console.log(data);
        updateBoothData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initial data fetch
updateData();

// Fetch data every 30 seconds
setInterval(updateData, 30000);

// New code for hover effect
document.addEventListener('DOMContentLoaded', (event) => {
    const boothsDiv = document.getElementById('booths');
    const boothInfo = document.getElementById('booth_info');

    function showDefaultMessage() {
        boothInfo.textContent = 'Hover over booth to see more info';
    }

    boothsDiv.addEventListener('mouseleave', showDefaultMessage);

    boothsDiv.addEventListener('mouseover', (event) => {
        if (event.target !== boothsDiv) {
            const boothNumber = event.target.textContent.trim(); // Get the text content of the booth box
            const boothName = event.target.getAttribute('data-name');
            boothInfo.innerHTML = `Booth #: ${boothNumber}<br>Vendor: ${boothName}`; // Use innerHTML to insert HTML content with a line break
        }
    });

    showDefaultMessage();
});
