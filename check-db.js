const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

// Query users table
console.log('=== USERS TABLE ===');
const users = db.prepare('SELECT * FROM users').all();
console.log(`Total users: ${users.length}`);
users.forEach(user => {
  console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
  console.log(`Bio: ${user.bio || 'N/A'}`);
  console.log(`Location: ${user.location || 'N/A'}, Company: ${user.company || 'N/A'}`);
  console.log(`GitHub: ${user.github_url || 'N/A'}, LinkedIn: ${user.linkedin_url || 'N/A'}`);
  console.log(`Twitter: ${user.twitter_url || 'N/A'}, Telegram: ${user.telegram_url || 'N/A'}`);
  console.log(`Website: ${user.website_url || 'N/A'}`);
  console.log(`Hobbies: ${user.hobbies || 'N/A'}`);
  console.log(`Profile Photo: ${user.profile_photo ? 'Yes' : 'No'}`);
  console.log(`Created: ${user.created_at}`);
  console.log('---');
});

// Query expertise table
console.log('\n=== USER EXPERTISE TABLE ===');
const expertise = db.prepare('SELECT * FROM user_expertise').all();
console.log(`Total expertise entries: ${expertise.length}`);
expertise.forEach(exp => {
  console.log(`User ID: ${exp.user_id}, Technology: ${exp.technology}`);
  console.log(`Expertise Level: ${exp.expertise_level}/10, Years: ${exp.years_experience}`);
  console.log('---');
});

db.close();
