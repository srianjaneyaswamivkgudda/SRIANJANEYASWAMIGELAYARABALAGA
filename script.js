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

  const fetchDataURL = "https://script.google.com/macros/s/AKfycbyBNxjlZGc8Kn4OBLHFVFi_HM4hr6oBbdU2odmFHzovtPcIPSHShmIOEngSfD2DwaeqYQ/exec"; // Replace with your Apps Script web app URL

  let membersData = [];
  let loggedInMember = null;

  function fetchSheetData() {
    fetch(fetchDataURL)
      .then(response => response.json())
      .then(data => {
        membersData = data;
      })
      .catch(err => alert("Failed to fetch data from server."));
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    loggedInMember = membersData.find(m => m.Username === username && m.Password === password);
    if (loggedInMember) {
      loginSection.style.display = 'none';
      memberDataSection.style.display = 'block';
      displayMemberData(loggedInMember);
    } else {
      loginError.style.display = 'block';
    }
  });

  function displayMemberData(member) {
    let html = `<h2>Welcome, ${member["Member Name"]}</h2>`;
    html += `<p>Balance: ₹${member["Balance"] || 0}</p>`;
    memberDataDiv.innerHTML = html;
  }

  contributionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const utr = document.getElementById('utr-number').value.trim();
    const date = transactionDateInput.value;
    const amount = amountInput.value;
    const method = paymentMethodInput.value;

    const url = `${fetchDataURL}?action=recordTransaction&username=${encodeURIComponent(loggedInMember.Username)}&utr=${encodeURIComponent(utr)}&date=${encodeURIComponent(date)}&amount=${encodeURIComponent(amount)}&method=${encodeURIComponent(method)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        contributionMessage.textContent = data.message;
        contributionMessage.style.color = data.status === 'success' ? 'green' : 'red';
        contributionMessage.style.display = 'block';
      });
  });

  fetchSheetData();
});
