const getMySQLPool = require('../config/mysql');

async function syncMySQLReport(report) {
  const pool = getMySQLPool();
  let mysqlUserId = null;
  if (report.reportedBy) {
    const [users] = await pool.execute('SELECT id FROM users WHERE mongo_id = ? LIMIT 1', [report.reportedBy.toString()]);
    mysqlUserId = users[0] ? users[0].id : null;
  }
  await pool.execute(
    `INSERT INTO animal_reports
      (mongo_id, description, place, animal_type, found_how, reported_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       description = VALUES(description), place = VALUES(place), animal_type = VALUES(animal_type),
       found_how = VALUES(found_how), reported_by = VALUES(reported_by), status = VALUES(status)`,
    [
      report._id.toString(), report.description, report.place, report.animalType,
      report.foundHow, mysqlUserId, report.status || 'Pending'
    ]
  );
}

module.exports = syncMySQLReport;