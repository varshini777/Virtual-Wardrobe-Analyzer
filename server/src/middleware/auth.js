import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wardrobe_analyzer_secure_jwt_secret_key_2026';

/**
 * Express middleware to authenticate JWT tokens and verify user identity.
 * Replaces insecure client-specified user IDs with cryptographically verified user claims.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      name: decoded.name
    };
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired authentication token. Please log in again.'
    });
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
