import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: false,
        trim: true,
    },
    last_name: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
    },
    phone: {
        type: Number,
        required: false,
        trim: true,
    },
    guardian_phone: {
        type: Number,
        required: false,
        trim: true,
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    profile_pic: {
        type: String,
        required: false,
        trim: true,
    },
    profileLink: {
        type: String,
        unique: true
    },
    history: [
        {
            field: String,
            oldValue: String,
            newValue: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
