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

    const fetchDataURL = "https://script.google.com/macros/s/AKfycbxVs-WGLDb1Jrz9Mf6HiOgQivbdzbwQAfYf7sstXYHXze71QCEoLV7JRAuC0CHyk67ICw/exec"; // <-- replace with your actual URL

    let membersData = [];
    let loggedInMember = null;

    function fetchSheetData() {
        fetch(fetchDataURL)
            .then(response => response.json())
            .then(data => {
                membersData = data;
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
            loginSection.style.display = 'none';
            qrCodeSection.style.display = 'block';
            memberDataSection.style.display = 'block';
            displayMemberData(loggedInMember);
        } else {
            loginError.style.display = 'block';
        }
    });

    function displayMemberData(member) {
        loggedInMember = member;
        let memberInfoHTML = `<p>Welcome, ${member["Member Name"] || 'Member'}!</p>`;
        memberInfoHTML += `<p>Member ID: ${member["Member ID"] || 'N/A'}</p>`;
        if (member["Balance"] !== undefined) {
            memberInfoHTML += `<p>Current Balance: ₹${member["Balance"] || 0}</p>`;
        }

        memberInfoHTML += "<h3>Monthly Contributions:</h3><ul>";
        const months = ['May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026'];
        months.forEach(month => {
            const contribution = member[month] || 0;
            memberInfoHTML += `<li>${month}: ₹${contribution}</li>`;
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
                    } else {
                        contributionMessage.textContent = "Failed to record transaction: " + data.message;
                        contributionMessage.style.display = 'block';
                        contributionMessage.style.color = 'red';
                    }
                })
                .catch(error => {
                    contributionMessage.textContent = "Error communicating with server.";
                    contributionMessage.style.display = 'block';
                    contributionMessage.style.color = 'red';
                });
        } else {
            contributionMessage.textContent = "Please fill all details.";
            contributionMessage.style.display = 'block';
            contributionMessage.style.color = 'red';
        }
    });

    fetchSheetData();
});
