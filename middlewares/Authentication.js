const jwt = require('jsonwebtoken');

const checkAuthentication = (req, res, nect) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'PLS, LogIn First',
            success: false,
        });
    }

    // check token is valid
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    if (!payload) {
        return res.status(403).json({
            message: 'Authentication failed',
            success: false,
        });
    }
    req.user = payload._id;
    nect();
}

module.exports = checkAuthentication;