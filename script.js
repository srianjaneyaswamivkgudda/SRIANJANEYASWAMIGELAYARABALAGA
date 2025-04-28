document.addEventListener('DOMContentLoaded', function() {
    // ... your existing JavaScript code ...
    const contributionForm = document.getElementById('contribution-form');
    const contributionMessage = document.getElementById('contribution-message');
    let loggedInMember = null; // Ensure this is correctly set after login

    // ... your existing fetchSheetData and login form event listener ...

    function displayMemberData(member) {
        loggedInMember = member; // Store the logged-in member's data
        // ... your existing displayMemberData function ...
    }

    contributionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const utrNumberInput = document.getElementById('utr-number').value.trim();

        if (utrNumberInput.length >= 10 && loggedInMember && loggedInMember.Username) { // Check if logged in
            const recordUTRURL = fetchDataURL + "?action=recordUTR&username=" + encodeURIComponent(loggedInMember.Username) + "&utr=" + encodeURIComponent(utrNumberInput);

            fetch(recordUTRURL)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        contributionMessage.textContent = "UTR recorded successfully.";
                        contributionMessage.style.display = 'block';
                        contributionMessage.style.color = 'green';
                        contributionForm.reset();
                        console.log("UTR recorded for:", loggedInMember.Username, "UTR:", utrNumberInput);
                        // Optionally, you might want to refresh the member data
                        // fetchSheetData();
                    } else {
                        contributionMessage.textContent = "Failed to record UTR: " + data.message;
                        contributionMessage.style.display = 'block';
                        contributionMessage.style.color = 'red';
                        console.error("Failed to record UTR:", data);
                    }
                })
                .catch(error => {
                    contributionMessage.textContent = "Error communicating with server.";
                    contributionMessage.style.display = 'block';
                    contributionMessage.style.color = 'red';
                    console.error("Error sending UTR:", error);
                });
        } else {
            contributionMessage.textContent = loggedInMember ? "Invalid UTR number format." : "Please log in to record UTR.";
            contributionMessage.style.display = 'block';
            contributionMessage.style.color = loggedInMember ? 'red' : 'orange';
        }
    });

    fetchSheetData();
});
