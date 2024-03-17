// Add a new schema to track changes
import mongoose from "mongoose";

const employeeHistorySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    field: {
        type: String,
        required: true,
    },
    oldValue: {
        type: String,
    },
    newValue: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const EmployeeHistory = mongoose.model(
    "EmployeeHistory",
    employeeHistorySchema
);

export default EmployeeHistory;
