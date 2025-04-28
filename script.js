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

    // ********************************************************************
    // IMPORTANT: REPLACE THIS WITH YOUR ACTUAL WEB APP URL FROM APPS SCRIPT
    const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec";
    // ********************************************************************

    let membersData = [];
    let loggedInMember = null;

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

        loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput);

        if (loggedInMember) {
            console.log("Login successful for:", loggedInMember["Member Name"]);
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
        loggedInMember = member;
        let memberInfoHTML = `<p>Welcome, ${member["Member Name"]}!</p>`;
        memberInfoHTML += `<p>Member ID: ${member["Member ID"]}</p>`;
        if (member["Balance"] !== undefined) {
            memberInfoHTML += `<p>Current Balance: ₹${member["Balance"]}</p>`;
        }

        memberInfoHTML += "<h3>Monthly Contributions:</h3><ul>";
        const months = ['May 2025', 'June 2025', 'July 2025', 'Agust 2025', 'Sept 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'];
        months.forEach(month => {
            if (member[month] !== undefined && member[month] !== null && member[month] !== '') {
                memberInfoHTML += `<li>${month}: ₹${member[month]}</li>`;
            } else {
                memberInfoHTML += `<li>${month}: ₹0</li>`;
            }
        });
        memberInfoHTML += "</ul>";

        memberDataDiv.innerHTML = memberInfoHTML;
    }

    contributionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const utrNumberInput = document.getElementById('utr-number').value.trim();
        const transactionDateValue = transactionDateInput.value;
        const amountValue = amountInput.value;
        const paymentMethodValue = paymentMethodInput.value;

        // UTR Validation TEMPORARILY REMOVED for testing
        if (utrNumberInput && transactionDateValue && amountValue && loggedInMember && loggedInMember.Username) {
            const recordTransactionURL = fetchDataURL + "?action=recordTransaction" +
                                         "&username=" + encodeURIComponent(loggedInMember.Username) +
                                         "&utr=" + encodeURIComponent(utrNumberInput) +
                                         "&date=" + encodeURIComponent(transactionDateValue) +
                                         "&amount=" + encodeURIComponent(amountValue) +
                                         "&method=" + encodeURIComponent(paymentMethodValue);

            fetch(recordTransactionURL)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        contributionMessage.textContent = "Transaction recorded successfully.";
                        contributionMessage.style.display = 'block';
                        contributionMessage.style.color = 'green';
                        contributionForm.reset();
                        console.log("Transaction recorded for:", loggedInMember.Username, "UTR:", utrNumberInput);
                    } else {
                        contributionMessage.textContent = "Failed to record transaction: " + data.message;
                        contributionMessage.style.display = 'block';
                        contributionMessage.style.color = 'red';
                        console.error("Failed to record transaction:", data);
                    }
                })
                .catch(error => {
                    contributionMessage.textContent = "Error communicating with server.";
                    contributionMessage.style.display = 'block';
                    contributionMessage.style.color = 'red';
                    console.error("Error sending transaction data:", error);
                });
        } else {
            let errorMessage = "Please fill in all required transaction details.";
            if (!loggedInMember) {
                errorMessage = "Please log in to record transaction.";
            } else if (!utrNumberInput) {
                errorMessage = "Please enter the UTR number.";
            } else if (!transactionDateValue) {
                errorMessage = "Please enter the transaction date.";
            } else if (!amountValue) {
                errorMessage = "Please enter the transaction amount.";
            }
            contributionMessage.textContent = errorMessage;
            contributionMessage.style.display = 'block';
            contributionMessage.style.color = 'red';
        }
    });

    fetchSheetData();
});
