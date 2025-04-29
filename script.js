document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const memberDataSection = document.getElementById('member-data-section');
  const memberDataDiv = document.getElementById('member-data');
  const loginError = document.getElementById('login-error');
  const contributionForm = document.getElementById('contribution-form');
  const contributionMessage = document.getElementById('contribution-message');
  const transactionDateInput = document.getElementById('transaction-date');
  const amountInput = document.getElementById('amount');
  const paymentMethodInput = document.getElementById('payment-method');

  // 🔁 REPLACE WITH YOUR DEPLOYED SCRIPT URL
  const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec";

  let membersData = [];
  let loggedInMember = null;

  function fetchSheetData() {
    fetch(fetchDataURL)
      .then(response => response.json())
      .then(data => {
        membersData = data;
      })
      .catch(error => {
        console.error("Error fetching sheet data:", error);
        alert("Could not fetch member data. Please try again later.");
      });
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    loggedInMember = membersData.find(member => member.Username === usernameInput && member.Password === passwordInput);

    if (loggedInMember) {
      loginSection.style.display = 'none';
      memberDataSection.style.display = 'block';
      document.getElementById('contribution-section').style.display = 'block';
      displayMemberData(loggedInMember);
      loginError.style.display = 'none';
    } else {
      loginError.style.display = 'block';
    }
  });

  function displayMemberData(member) {
    let html = `<p><strong>Welcome, ${member["Member Name"]}!</strong></p>`;
    html += `<p>Member ID: ${member["Member ID"]}</p>`;
    if (member["Balance"] !== undefined) {
      html += `<p>Balance: ₹${member["Balance"]}</p>`;
    }

    const months = ['May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026'];
    html += "<h3>Contributions:</h3><ul>";
    months.forEach(month => {
      const val = member[month] || 0;
      html += `<li>${month}: ₹${val}</li>`;
    });
    html += "</ul>";
    memberDataDiv.innerHTML = html;
  }

  contributionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const utr = document.getElementById('utr-number').value.trim();
    const date = transactionDateInput.value;
    const amount = amountInput.value;
    const method = paymentMethodInput.value;

    if (!loggedInMember || !utr || !date || !amount) {
      contributionMessage.textContent = "All fields are required.";
      contributionMessage.style.color = "red";
      return;
    }

    const url = `${fetchDataURL}?action=recordTransaction&username=${encodeURIComponent(loggedInMember.Username)}&utr=${encodeURIComponent(utr)}&date=${encodeURIComponent(date)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          contributionMessage.textContent = "Contribution recorded successfully.";
          contributionMessage.style.color = "green";
          contributionForm.reset();
        } else {
          contributionMessage.textContent = `Error: ${data.message}`;
          contributionMessage.style.color = "red";
        }
      })
      .catch(error => {
        console.error("Error recording transaction:", error);
        contributionMessage.textContent = "Server error. Try again.";
        contributionMessage.style.color = "red";
      });
  });

  fetchSheetData();
});
