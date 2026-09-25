require('dotenv').config();
const connectMongo = require('../config/db');
const User = require('../models/User');
const syncMySQLUser = require('../utils/syncMySQLUser');

(async () => {
  await connectMongo();
  const users = await User.find();
  for (const user of users) {
    await syncMySQLUser(user);
    console.log('Synced:', user.email);
  }
  console.log(`Synced ${users.length} MongoDB users to MySQL.`);
  process.exit(0);
})().catch((error) => {
  console.error('MySQL user sync failed:', error.message);
  process.exit(1);
});