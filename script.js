document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const contributionSection = document.getElementById('contribution-section');
    const contributionDetailsDiv = document.getElementById('contribution-details');
    const loginError = document.getElementById('login-error');

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbx7dxkH_FW3VEhzIXucd3ieWnEP2AKjvhODySMr-NZT/dev";
    // ********************************************************************

    let membersData = [];

    function fetchSheetData() {
        console.log("Fetching data from:", fetchDataURL);
        fetch(fetchDataURL)
            .then(response => {
                console.log("Fetch response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                membersData = data;
                console.log("Data fetched successfully:", membersData);
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

        console.log("Attempting login with:", { username: usernameInput, password: passwordInput });

        const loggedInMember = membersData.find(member => {
            console.log("Comparing with member:", { Username: member.Username, Password: member.Password });
            return member.Username === usernameInput && member.Password === passwordInput;
        });

        if (loggedInMember) {
            console.log("Login successful for:", member["Member Name"]);
            loginSection.style.display = 'none';
            contributionSection.style.display = 'block';
            displayContributions(loggedInMember);
        } else {
            console.log("Login failed.");
            loginError.style.display = 'block';
        }
    });

    function displayContributions(member) {
        let contributionsHTML = '';
        for (const key in member) {
            if (key === 'May 2025' || key === 'June 2025' || key === 'July 2025' || key === 'Agust 2025' || key === 'Sept 2025' || key === 'Oct 2025' || key === 'Nov 2025' || key === 'Dec 2025' || key === 'Jan 2026' || key === 'Feb 2026') {
                contributionsHTML += `<p>${key}: ₹${member[key] || '0'}</p>`;
            }
        }
        contributionDetailsDiv.innerHTML = contributionsHTML;
    }

    fetchSheetData();
});
