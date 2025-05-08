document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbwbTkHdDdVyGaOPet43nqoAUEQFoWcsZ7k-ULQsg_rY1BbWzw9GtGYFYWFPkpBIqG5A/exec";
    // ********************************************************************

    let membersData = [];
    let loggedInMember = null;
    let usernameHeader = "Username"; // Ensure these match your sheet headers exactly
    let passwordHeader = "Password";
    let memberNameHeader = "\tName";     // Ensure this matches your sheet header exactly (note the tab!)
    let memberIdHeader = "Member ID";
    const nextPageURL = "/dashboard.html"; // Replace with the actual URL of your next page

    function fetchSheetData() {
        fetch(fetchDataURL)
            .then(response => response.text()) // Get the response as text
            .then(html => {
                // Extract the JSON string from within the <pre> tags
                const jsonString = html.substring(html.indexOf('['), html.lastIndexOf(']') + 1);
                membersData = JSON.parse(jsonString);
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

        loggedInMember = membersData.find(member => member[usernameHeader] === usernameInput && member[passwordHeader] === passwordInput);

        if (loggedInMember) {
            loginSection.style.display = 'none';
            memberDataSection.style.display = 'block';
            displayMemberData(loggedInMember);
        } else {
            loginError.style.display = 'block';
            loginError.textContent = "Invalid username or password";
        }
    });

    function displayMemberData(member) {
        const memberName = member[memberNameHeader] || "Member";
        const memberId = member[memberIdHeader] || "N/A";
        memberDataDiv.innerHTML = `
            <p>Welcome, ${memberName}!</p>
            <p>Member ID: ${memberId}</p>
            <a href="home.html">click to next view</a>
            <button id="home.html">Go to Dashboard</button>
        `;

        const nextPageButton = document.getElementById('next-page-button');
        nextPageButton.addEventListener('click', function() {
            window.location.href ="home.html";
        });
    }

    fetchSheetData();
});
