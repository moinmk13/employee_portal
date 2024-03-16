import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import lang from '../utils/language/english';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import tokenTypes from '../config/tokens';

interface AuthTokens {
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
}

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, role: string, expires: moment.Moment, type: string, secret = config.jwt.secret): string => {
    const payload = {
        sub: userId,
        role,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
// @ts-ignore
const saveToken = async (token: string, userId: string, role: string, expires: moment.Moment, type: string, refreshToken: string, refreshTokenExpires: moment.Moment, blacklisted = false): Promise<Token> => {
    const tokenDoc = await Token.create({
        token,
        refreshToken,
        user: userId,
        role,
        expires: expires.toDate(),
        refreshTokenExpires: refreshTokenExpires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */

// @ts-ignore
const verifyToken = async (token: string, type: string): Promise<Token> => {
    try {

        const payload = jwt.verify(token, config.jwt.secret) as {
            role: string; sub: string
        };
        const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
        if (!tokenDoc) {
            throw new Error(lang.common.tokenNotFound);
        }

        return { id: payload.sub, role: payload.role };
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, lang.common.tokenRetrieval);
    }
};

const refreshUserToken = async (refreshToken: string, type: string) => {
    try {

        const payload = jwt.verify(refreshToken, config.jwt.secret) as {
            role: string; sub: string
        };
        const tokenDoc = await Token.findOne({ refreshToken, type, user: payload.sub, blacklisted: false });
        if (!tokenDoc) {
            throw new Error(lang.common.tokenNotFound);
        }

        return tokenDoc;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, lang.common.tokenRetrieval);
    }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokens>}
 */
const generateAuthTokens = async (user: any): Promise<AuthTokens> => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, user.role, accessTokenExpires, tokenTypes.ACCESS);
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(accessToken, user.id, user.role, accessTokenExpires, tokenTypes.REFRESH, refreshToken, refreshTokenExpires);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

const verifyUser = async (t: string, body: any) =>{
      let verify = await verifyToken(t.split(' ')[1], tokenTypes.REFRESH);
      body.id = verify?.id;
      body.role = verify?.role;
      return body;
}

export {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    refreshUserToken,
    verifyUser,
};
