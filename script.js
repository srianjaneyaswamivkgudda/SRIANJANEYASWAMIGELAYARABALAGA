document.getElementById('contributionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        username: document.getElementById('username').value,
        name: document.getElementById('name').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        utr: document.getElementById('utr').value,
        timestamp: new Date().toISOString(),
    };

    try {
        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Contribution submitted successfully!');
            document.getElementById('contributionForm').reset();
        } else {
            alert('Submission failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
