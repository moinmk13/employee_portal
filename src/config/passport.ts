import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import config from './config';
import tokenTypes from './tokens';
import  User  from '../models/user.model';

class JwtAuthStrategy {
    private static jwtOptions: StrategyOptionsWithRequest = {
        secretOrKey: config.jwt.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true, // Make sure to set passReqToCallback to true
    };

    private static async jwtVerify(req: any, payload: any, done: any) {
        try {
            if (payload.type !== tokenTypes.ACCESS) {
                throw new Error('Invalid token type');
            }

            const user = await User.findById(payload.sub);

            if (!user) {
                return done(null, false);
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }

    public static jwtStrategy = new JwtStrategy(JwtAuthStrategy.jwtOptions, JwtAuthStrategy.jwtVerify);
}

export default JwtAuthStrategy;
