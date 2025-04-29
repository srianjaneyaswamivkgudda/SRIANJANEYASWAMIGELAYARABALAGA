document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Fetch data from Google Sheets (replace with your published Google Sheets URL)
    const sheetUrl = 'YOUR_GOOGLE_SHEET_URL'; // Replace with your actual Google Sheets URL

    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            const members = data.values;
            const member = members.find(m => m[2] === username && m[3] === password);
            
            if (member) {
                document.getElementById('login').style.display = 'none';
                document.getElementById('contributions').style.display = 'block';
                document.getElementById('contributionData').innerHTML = `
                    <p>Member ID: ${member[0]}</p>
                    <p>Name: ${member[1]}</p>
                    <p>UTR Number: ${member[4]}</p>
                    <p>May Contribution: ${member[5]}</p>
                    <p>June Contribution: ${member[6]}</p>
                    <p>July Contribution: ${member[7]}</p>
                    <p>August Contribution: ${member[8]}</p>
                    <p>September Contribution: ${member[9]}</p>
                    <p>October Contribution: ${member[10]}</p>
                    <p>November Contribution: ${member[11]}</p>
                    <p>December Contribution: ${member[12]}</p>
                    <p>January Contribution: ${member[13]}</p>
                    <p>February Contribution: ${member[14]}</p>
                    <p>Balance: ${member[15]}</p>
                    <p>Last Transaction Date: ${member[16]}</p>
                `;
                // You can also fetch and display admin updates here if needed
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
