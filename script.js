document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const qrCodeSection = document.getElementById('qr-code-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://docs.google.com/spreadsheets/d/1U29kiKXwOMXq1prZhX77XGdjyuretFkfi412e-LegOg/edit?usp=sharing";
    // ********************************************************************

    let membersData = [];

    function fetchSheetData() {
        fetch(fetchDataURL)
            .then(response => response.json())
            .then(data => {
                membersData = data;
                console.log("Data fetched:", membersData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert("Failed to load member data.");
            });
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        const loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput); // Adjust keys if needed

        if (loggedInMember) {
            loginSection.style.display = 'none';
            qrCodeSection.style.display = 'block';
            memberDataSection.style.display = 'block';
            displayMemberData(loggedInMember);
        } else {
            loginError.style.display = 'block';
        }
    });

    function displayMemberData(member) {
        let memberInfoHTML = `<p>Welcome, ${member["Member Name"]}!</p>`; // Adjust key if needed

        // Display other member data as needed
        memberInfoHTML += `<p>Member ID: ${member["Member ID"]}</p>`;

        memberDataDiv.innerHTML = memberInfoHTML;
    }

    fetchSheetData();
});
