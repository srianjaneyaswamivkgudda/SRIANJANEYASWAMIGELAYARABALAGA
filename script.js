document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbxwzEdLBUbBpYyKOHQp4iaeWiGnmIJcNvNjDxaHk8teW1o-U-gb75eWYmSgYl-PT5dQ/exec";
    // ********************************************************************

    let membersData = [];
    let loggedInMember = null;
    let usernameHeader = "Username"; // Ensure these match your sheet headers exactly
    let passwordHeader = "Password";
    let memberNameHeader = "Member Name"; // Assuming you have a "Member Name" header
    let memberIdHeader = "Member ID";     // Assuming you have a "Member ID" header

    function fetchSheetData() {
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
        memberDataDiv.innerHTML = `<p>Welcome, ${memberName}!</p><p>Member ID: ${memberId}</p>`;
    }

    fetchSheetData();
});
