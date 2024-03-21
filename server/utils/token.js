const JWT_SECRET_KEY = 'f2$H#0pL&9A!zqN{=8JhYgGDH85DH5ZsXxUrZ';
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    const options = {
        expiresIn: '24h', 
    };
    return jwt.sign(payload, JWT_SECRET_KEY, options);
};
const verifyToken= (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {  
            return res.status(401).json({ error: 'Invalid token' });
        }
    req.userId = decoded.userId; 
    next();
    });
}

module.exports = {generateToken ,verifyToken} ;