const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { JWT_SECRET } = require('./env');

const opts = {
    jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(
    new JwtStrategy(opts, async(jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if(user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(null, false);
        }
    })
);

module.exports = passport;