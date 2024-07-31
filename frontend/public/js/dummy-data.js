// Function to generate random patient data
function generateRandomPatient() {
  const names = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Chris Davis",
  ];
  const codes = ["JD1", "JS2", "AJ3", "BB4", "CD5"];
  const severities = ["low", "medium", "high"];
  const waitTimes = [
    "10 minutes",
    "20 minutes",
    "30 minutes",
    "40 minutes",
    "50 minutes",
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const code = codes[Math.floor(Math.random() * codes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const waitTime = waitTimes[Math.floor(Math.random() * waitTimes.length)];

  return { name, code, severity, waitTime };
}

// Populate the patient table with random data
function populatePatientTable() {
  const tableBody = document.querySelector("#patient-table tbody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear existing data
    for (let i = 0; i < 5; i++) {
      // Generate 10 random patients
      const patient = generateRandomPatient();
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.code}</td>
                <td>${patient.severity}</td>
                <td>${patient.waitTime}</td>
            `;
      tableBody.appendChild(row);
    }
  }
}

// Call the function to populate the table when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", populatePatientTable);
