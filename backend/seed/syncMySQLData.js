require('dotenv').config();
const connectMongo = require('../config/db');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Report = require('../models/Report');
const syncMySQLUser = require('../utils/syncMySQLUser');
const syncMySQLDonation = require('../utils/syncMySQLDonation');
const syncMySQLReport = require('../utils/syncMySQLReport');

(async () => {
  await connectMongo();

  const users = await User.find();
  for (const user of users) await syncMySQLUser(user);

  const donations = await Donation.find();
  for (const donation of donations) await syncMySQLDonation(donation);

  const reports = await Report.find();
  for (const report of reports) await syncMySQLReport(report);

  console.log(`Synced ${users.length} users, ${donations.length} donations, and ${reports.length} animal reports to MySQL.`);
  process.exit(0);
})().catch((error) => {
  console.error('MySQL data sync failed:', error.message);
  process.exit(1);
});