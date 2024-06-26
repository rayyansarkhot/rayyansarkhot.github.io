const API_KEY = 'AIzaSyDE_jHlwUTO62TvAZqVPIgyOd0B0J8sLmo';
const SPREADSHEET_ID = '1-ceK_eeykNUdE_oHWzFq-jFG6XVR-t5EL-7-QcAVjns';
const RANGE = 'Sheet1!A1:B65'; // Change to your range

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

function updateBoothData(data) {
    const boothsDiv = document.getElementById('booths').children;

    // Assuming data is an array of arrays, where the first element is the booth number and the second element is the booth name
    data.forEach(row => {
        const boothNumber = row[0].slice(0,-1);
        const boothName = row[1];
        
        // Find the booth div by id
        const boothDiv = document.getElementById(`booth${boothNumber}`);

        if (boothDiv) {
            // Update the data-name attribute with the booth name
            boothDiv.setAttribute('data-name', boothName);

            // Set the background color to light red if the vendor name is not null
            if (boothName !== "Null" && boothName.trim() !== '') {
                boothDiv.style.backgroundColor = 'red'; // You can use any shade of light red
            } else {
                boothDiv.style.backgroundColor = ''; // Reset the background color if the vendor name is null or empty
            }

            // Add hover event listeners
            boothDiv.addEventListener('mouseover', showBoothInfo);
            boothDiv.addEventListener('mouseout', hideBoothInfo);
        }
    });
}

function showBoothInfo(event) {
    const boothDiv = event.target;
    const boothInfoDiv = document.getElementById('booth-info');
    const boothName = boothDiv.getAttribute('data-name');
    
    // Only show the popup if the booth name is not "Null"
    if (boothName !== "Null" && boothName.trim() !== '') {
        boothInfoDiv.innerHTML = `Booth: ${boothDiv.textContent}`;
        boothInfoDiv.style.display = 'block';
    }
}

function hideBoothInfo() {
    const boothInfoDiv = document.getElementById('booth-info');
    boothInfoDiv.style.display = 'none';
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
