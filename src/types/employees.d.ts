/**
 * @typedef {Object} employees 
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} profile_pic
 * @property {number} phone
 * @property {number} guardian_phone
 * @property {string} address
 */

export interface  employees {
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    guardian_phone?: number | null;
    address: string;
    profile_pic: string;
}