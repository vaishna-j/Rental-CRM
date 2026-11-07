const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Not Authorized. Please Login',
      });
    }

    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid Token',
    });
  }
};

module.exports = authMiddleware;
