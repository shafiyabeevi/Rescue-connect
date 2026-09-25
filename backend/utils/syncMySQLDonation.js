const getMySQLPool = require('../config/mysql');

async function syncMySQLDonation(donation) {
  const pool = getMySQLPool();
  await pool.execute(
    `INSERT INTO fund_transactions
      (mongo_id, donor_name, phone, amount, payment_method, upi_id, txn_ref, verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       donor_name = VALUES(donor_name), phone = VALUES(phone), amount = VALUES(amount),
       payment_method = VALUES(payment_method), upi_id = VALUES(upi_id),
       txn_ref = VALUES(txn_ref), verified = VALUES(verified)`,
    [
      donation._id.toString(), donation.name, donation.phone, donation.amount,
      donation.paymentMethod, donation.upiId, donation.txnRef || null, !!donation.verified
    ]
  );
}

module.exports = syncMySQLDonation;