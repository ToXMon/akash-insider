// Simple script to check database via API
fetch('http://localhost:3000/api/profiles')
  .then(response => response.json())
  .then(data => {
    console.log('=== DATABASE CHECK RESULTS ===');
    console.log('API Response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
