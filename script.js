document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const qrCodeSection = document.getElementById('qr-code-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');
    const contributionForm = document.getElementById('contribution-form');
    const contributionMessage = document.getElementById('contribution-message');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbxVs-WGLDb1Jrz9Mf6HiOgQivbdzbwQAfYf7sstXYHXze71QCEoLV7JRAuC0CHyk67ICw/exec";
    // ********************************************************************

    let membersData = [];
    let loggedInMember = null; // To store the logged-in member's data

    function fetchSheetData() {
        console.log("Fetching data from:", fetchDataURL);
        fetch(fetchDataURL)
            .then(response => response.json())
            .then(data => {
                membersData = data;
                console.log("Data fetched:", membersData);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Failed to load member data.");
            });
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput); // Assuming "Username" and "Password" are your keys

        if (loggedInMember) {
            console.log("Login successful for:", loggedInMember["Member Name"]); // Adjust key if needed
            loginSection.style.display = 'none';
            qrCodeSection.style.display = 'block';
            memberDataSection.style.display = 'block';
            displayMemberData(loggedInMember);
        } else {
            console.log("Login failed.");
            loginError.style.display = 'block';
        }
    });

    function displayMemberData(member) {
        loggedInMember = member; // Ensure loggedInMember is set when member data is displayed
        let memberInfoHTML = `<p>Welcome, ${member["Member Name"]}!</p>`; // Adjust key if needed
        memberInfoHTML += `<p>Member ID: ${member["Member ID"]}</p>`; // Adjust key if needed
        if (member["Balance"] !== undefined) { // Assuming you have a "Balance" column
            memberInfoHTML += `<p>Current Balance: ₹${member["Balance"]}</p>`; // Adjust key if needed
        }

        // Display monthly contributions
        memberInfoHTML += "<h3>Monthly Contributions:</h3><ul>";
        const months = ['May 2025', 'June 2025', 'July 2025', 'Agust 2025', 'Sept 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026']; // Add all your month columns
        months.forEach(month => {
            if (member[month] !== undefined && member[month] !== null && member[month] !== '') {
                memberInfoHTML += `<li>${month}: ₹${member[month]}</li>`;
            } else {
                memberInfoHTML += `<li>${month}: ₹0</li>`; // Or display a different message if no contribution
            }
        });
        memberInfoHTML += "</ul>";

        memberDataDiv.innerHTML = memberInfoHTML;
    }

    contributionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const utrNumberInput = document.getElementById('utr-number').value.trim();

        if (utrNumberInput === "12" && loggedInMember && loggedInMember.Username) { // Check if logged in *and* UTR is "12" for testing
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
            contributionMessage.textContent = loggedInMember ? "Invalid UTR number (must be '12' for this test)." : "Please log in to record UTR.";
            contributionMessage.style.display = 'block';
            contributionMessage.style.color = loggedInMember ? 'red' : 'orange';
        }
    });

    fetchSheetData();
});
