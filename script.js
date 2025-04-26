document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const contributionSection = document.getElementById('contribution-section');
    const contributionDetailsDiv = document.getElementById('contribution-details');
    const loginError = document.getElementById('login-error');

    // Replace with your Web App URL from Apps Script
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec";

    let membersData = [];

    // Function to fetch data from the Web App URL (returns JSON)
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

    // Handle login submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        const loggedInMember = membersData.find(member => member.usrname === usernameInput && member.psswd === passwordInput);

        if (loggedInMember) {
            loginSection.style.display = 'none';
            contributionSection.style.display = 'block';
            displayContributions(loggedInMember);
        } else {
            loginError.style.display = 'block';
        }
    });

    // Function to display member contributions
    function displayContributions(member) {
        let contributionsHTML = '';
        for (const key in member) {
            if (key.includes('months till') || key === 'Total Contribution') {
                contributionsHTML += `<p>${key}: ₹${member[key]}</p>`;
            }
        }
        contributionDetailsDiv.innerHTML = contributionsHTML;
    }

    // Fetch data when the page loads
    fetchSheetData();
});
