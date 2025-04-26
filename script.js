document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const qrCodeSection = document.getElementById('qr-code-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec";
    // ********************************************************************

    let membersData = [];

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

        if (membersData && membersData.length > 0) {
            const loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput); // Assuming "Username" and "Password" are your keys

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
        } else {
            console.log("No member data loaded yet.");
            loginError.style.display = 'block'; // Or a more informative message
        }
    });

    function displayMemberData(member) {
        let memberInfoHTML = `<p>Welcome, ${member["Member Name"]}!</p>`; // Adjust key if needed
        memberInfoHTML += `<p>Member ID: ${member["Member ID"]}</p>`; // Adjust key if needed

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

    fetchSheetData();
});
