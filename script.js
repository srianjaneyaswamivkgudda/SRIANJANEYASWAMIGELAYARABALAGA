document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const contributionSection = document.getElementById('contribution-section');
    const contributionDetailsDiv = document.getElementById('contribution-details');
    const loginError = document.getElementById('login-error');

    const fetchDataURL = "https://script.google.com/macros/s/AKfycbx7dxkH_FW3VEhzIXucd3ieWnEP2AKjvhODySMr-NZT/dev"; // Make sure this is correct

    let membersData = [];
    function fetchSheetData() {
    console.log("Fetching data from:", fetchDataURL); // Log the URL being used
    fetch(fetchDataURL)
        .then(response => {
            console.log("Fetch response:", response); // Log the entire response object
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle non-200 responses
            }
            return response.json();
        })
        .then(data => {
            membersData = data;
            console.log("Data fetched successfully:", membersData);
        })
        .catch(error => {
            console.error("Fetch error:", error); // Log the full error message
            alert("Failed to load member data.");
        });
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        const loggedInMember = membersData.find(member => {
            return member.Username === usernameInput && member.Password === passwordInput; // Using "Username" and "Password"
        });

        if (loggedInMember) {
            loginSection.style.display = 'none';
            contributionSection.style.display = 'block';
            displayContributions(loggedInMember);
        } else {
            loginError.style.display = 'block';
        }
    });

    function displayContributions(member) {
        let contributionsHTML = '';
        for (const key in member) {
            if (key === 'May 2025' || key === 'June 2025' || key === 'July 2025' || key === 'Agust 2025' || key === 'Sept 2025' || key === 'Oct 2025' || key === 'Nov 2025' || key === 'Dec 2025' || key === 'Jan 2026' || key === 'Feb 2026') {
                contributionsHTML += `<p>${key}: ₹${member[key] || '0'}</p>`; // Handle empty contributions
            }
        }
        contributionDetailsDiv.innerHTML = contributionsHTML;
    }

    fetchSheetData();
});
