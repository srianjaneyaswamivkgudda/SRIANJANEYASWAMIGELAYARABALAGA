const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec"; // Replace with your actual Web App URL

function recordTransaction() {
  const username = document.getElementById("username").value;
  const utr = document.getElementById("utr").value;
  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const method = document.getElementById("method").value; // Get the payment method

  if (!username || !utr || !date || !amount) {
    alert("Please fill in all required fields (Username, UTR, Date, Amount).");
    return;
  }

  // Log the data to be sent (for debugging)
  console.log("Sending data:", { username, utr, date, amount, method });

  const url = `${fetchDataURL}?action=recordTransaction&username=${encodeURIComponent(username)}&utr=${encodeURIComponent(utr)}&date=${encodeURIComponent(date)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`; // Include method

  fetch(url, {
    method: "GET", // Or "POST", whichever you're using in Apps Script
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Response from server:", data); // Log the response

    if (data.status === "success") {
      alert("Transaction recorded successfully!");
      // Clear the form fields upon successful submission
      document.getElementById("username").value = "";
      document.getElementById("utr").value = "";
      document.getElementById("date").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("method").value = ""; // Clear method
      // You might also want to refresh the displayed data here
      fetchData(); // Reload data after successful submission
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    alert("Failed to record transaction. Please check console for errors.");
  });
}

function fetchData() {
  fetch(fetchDataURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Data fetched:", data); // Log the fetched data
      const dataContainer = document.getElementById("data-container");
      dataContainer.innerHTML = ""; // Clear previous data

      if (data && !data.error) {
        let tableHTML = "<table border='1'><tr>";

        // Get the headers dynamically from the first data object.  Handles empty data.
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
        }
        tableHTML += "</tr>";

        // Loop through the data and create table rows
        data.forEach(item => {
          tableHTML += "<tr>";
          for (const key in item) {
            tableHTML += `<td>${item[key]}</td>`;
          }
          tableHTML += "</tr>";
        });
        tableHTML += "</table>";
        dataContainer.innerHTML = tableHTML;
      } else if (data && data.error) {
        dataContainer.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        dataContainer.innerHTML = "<p>No data available.</p>"; // Handle empty data case
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      document.getElementById("data-container").innerHTML = "Failed to fetch data.";
    });
}

// Call fetchData when the page loads
window.onload = fetchData;
