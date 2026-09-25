const getMySQLPool = require('../config/mysql');

async function syncMySQLUser(user) {
  const pool = getMySQLPool();
  await pool.execute(
    `INSERT INTO users
      (mongo_id, firstname, lastname, phone, email, age, gender, place, role, score)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       firstname = VALUES(firstname), lastname = VALUES(lastname), phone = VALUES(phone),
       email = VALUES(email), age = VALUES(age), gender = VALUES(gender), place = VALUES(place),
       role = VALUES(role), score = VALUES(score)`,
    [
      user._id.toString(), user.firstname, user.lastname, user.phone, user.email,
      user.age, user.gender, user.place, user.role, user.score || 0
    ]
  );
}

module.exports = syncMySQLUser;