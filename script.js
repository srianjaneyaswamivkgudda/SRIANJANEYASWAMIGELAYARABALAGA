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
            .then(response => {
                console.log("Fetch response:", response);
                return response.json();
            })
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
        memberDataDiv.innerHTML = memberInfoHTML;
    }

    fetchSheetData();
});
