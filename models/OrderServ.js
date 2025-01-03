const mongoose = require("mongoose");

const OrderServSchema = mongoose.Schema({
    name: {
        type: String,
    },
    details: {
        type: String,
    },
    coordinates: {
        type: {
            type: String, // GeoJSON object type
            enum: ["Point"], // Must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number], // Array of numbers (longitude, latitude)
            required: true,
        },
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "in progress", "completed"],
        default: "Pending",
    },
    desiredTime: {
        type: Date,
    },
    desiredDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    acceptedAt: {
        type: Date,
        default: Date.now,
    },
    finishedAt: {
        type: Date,
    },
});

OrderServSchema.index({ coordinates: "2dsphere" }); // 2dsphere index for geospatial queries

module.exports = mongoose.model("orderService", OrderServSchema);
