function add(isAutofiller = false, inp1 = "{{City}}", inp2 = "{{Country}}") {
    var city;
    var country;

    // If autofilling, use inp1 and inp2 parameters. Otherwise, use user inputs
    if (isAutofiller) {
        city = inp1;
        country = inp2;
    } else {
        city = document.getElementById("city").value;
        country = document.getElementById("country").value;

        // Checks if invalid input
        if (city == "" || country == "") {
            console.log("Invalid input");
            return false;
        }
    }

    // Import template for new row
    var newRow = document.importNode(document.getElementById("rowContent").content, true);

    // Access table's cells using querySelector
    newRow.querySelector("calcite-table-cell").textContent = city;
    newRow.querySelector("calcite-table-cell:nth-child(2)").textContent = country;

    // Add new row to the table's slot
    document.getElementById("results").querySelector("slot").appendChild(newRow);

    displayFilter();

    // Clear the input fields for the next entry
    document.getElementById("city").value = "";
    document.getElementById("country").value = "";

    return true;
}


function autofill() {
    // Fetch SampleServer6 data
    fetch("https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/0/query?where=pop_rank=1 OR pop_rank=2&outFields=city_name%2C+cntry_name&f=json")
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            // Add row for each result queried
            for (feature in responseJson.features) {
                add(true, responseJson.features[feature].attributes.CITY_NAME, responseJson.features[feature].attributes.CNTRY_NAME);
            }

            // Disables autofill button and show filter input
            document.getElementById("autofill").disabled = true;
            displayFilter();
        })
        .catch((error) => {
            console.error("Error fetch data:", error);
        });
}


function checkEnter(event) {
    // Check if enter key is pressed
    if (event.keyCode == 13) {
        // If row is successfully added, reset focus to City input
        if (add(0)) {
            document.getElementById("city").setFocus();
        }
    }
}


function filterTable() {
    const input = document.getElementById("filter");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("results");

    for (const tr of table.getElementsByTagName("calcite-table-row")) {
        const cityCell = tr.getElementsByTagName("calcite-table-cell")[0]; // Column 1
        const countryCell = tr.getElementsByTagName("calcite-table-cell")[1]; // Column 2

        if (!cityCell || !countryCell) continue; // Skip rows without the target cell

        const cityTextValue = cityCell.textContent;
        const countryTextValue = countryCell.textContent;

        if (cityTextValue.toLowerCase().startsWith(filter) || countryTextValue.toLowerCase().startsWith(filter)) {
            tr.style.display = ""; // Show matching rows
        } else {
            tr.style.display = "none"; // Hide non-matching rows
        }
    }
}


function clearTable() {
    // Clears the table, hides filter input, disables Clear button and enables Autofill button
    document.getElementById("results").querySelector("slot").innerHTML = "";
    document.getElementById("filter").style.display = "none";
    document.getElementById("clear").disabled = true;
    document.getElementById("autofill").disabled = false;
}

function displayFilter() {
    // Show filter input, enable Clear button
    document.getElementById("filter").style.display = "block";
    document.getElementById("clear").disabled = false;
    filterTable();
}