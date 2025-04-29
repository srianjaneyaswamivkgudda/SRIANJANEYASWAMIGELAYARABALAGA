document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const qrCodeSection = document.getElementById('qr-code-section');
    const memberDataSection = document.getElementById('member-data-section');
    const memberDataDiv = document.getElementById('member-data');
    const loginError = document.getElementById('login-error');
    const contributionForm = document.getElementById('contribution-form');
    const contributionMessage = document.getElementById('contribution-message');
    const transactionDateInput = document.getElementById('transaction-date');
    const amountInput = document.getElementById('amount');
    const paymentMethodInput = document.getElementById('payment-method');

    const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec"; 
    // <<<<<<<<<<<< Replace with your real Apps Script URL

    let membersData = [];
    let loggedInMember = null;

    function fetchSheetData() {
        fetch(fetchDataURL)
            .then(response => response.json())
            .then(data => {
                membersData = data;
            })
            .catch(error => {
                alert("Failed to load member data.");
            });
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput);

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
        let html = `<p>Welcome, ${member["Member Name"]}!</p>`;
        html += `<p>Member ID: ${member["Member ID"]}</p>`;
        if (member["Balance"]) {
            html += `<p>Current Balance: ₹${member["Balance"]}</p>`;
        }
        html += "<h3>Monthly Contributions:</h3><ul>";

        const months = ['May 2025', 'June 2025', 'July 2025', 'Agust 2025', 'Sept 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'];
        months.forEach(month => {
            html += `<li>${month}: ₹${member[month] || 0}</li>`;
        });
        html += "</ul>";

        memberDataDiv.innerHTML = html;
    }

    contributionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const utr = document.getElementById('utr-number').value.trim();
        const date = transactionDateInput.value;
        const amount = amountInput.value;
        const method = paymentMethodInput.value;

        if (utr && date && amount && loggedInMember && loggedInMember.Username) {
            const url = fetchDataURL + `?action=recordTransaction&username=${encodeURIComponent(loggedInMember.Username)}&utr=${encodeURIComponent(utr)}&date=${encodeURIComponent(date)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        contributionMessage.textContent = "Transaction recorded successfully.";
                        contributionMessage.style.color = "green";
                        contributionForm.reset();
                    } else {
                        contributionMessage.textContent = "Error: " + data.message;
                        contributionMessage.style.color = "red";
                    }
                    contributionMessage.style.display = "block";
                })
                .catch(error => {
                    contributionMessage.textContent = "Server Error.";
                    contributionMessage.style.color = "red";
                    contributionMessage.style.display = "block";
                });
        } else {
            contributionMessage.textContent = "Fill all transaction details.";
            contributionMessage.style.color = "red";
            contributionMessage.style.display = "block";
        }
    });

    fetchSheetData();
});
