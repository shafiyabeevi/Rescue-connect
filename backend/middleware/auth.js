/**
 * JWT auth middleware + role guard.
 * Ensures: (a) only logged-in users can hit protected routes,
 * (b) only users who actually completed Registration (role='volunteer')
 *     or the single fixed admin account (role='admin') can log in at all,
 * (c) fund/analytics routes are admin-only.
 */
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please login.' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rescueConnectSuperSecretKey2024');
    req.user = decoded; // { id, role, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to admin only (e.g. Fund Received page).' });
  }
  next();
};

module.exports = { protect, adminOnly };
