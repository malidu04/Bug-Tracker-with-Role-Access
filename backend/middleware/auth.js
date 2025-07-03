const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
    if(typeof roles === 'string') {
        roles = [roles];
    }
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if(!token) {
                throw new Error('Authorization required');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id });

            if(!user) {
                throw new Error('User not found');
            }

            if(roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permission' });
            }

            req.token = token;
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Please authenticate' });
        }
    };

};

export default auth;