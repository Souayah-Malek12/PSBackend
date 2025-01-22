const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },
    role: {
      type: String,
      enum: ["Administrator", "Service Client", "Worker", "Client"],
      default: "Client",
    },
    jobs: {
      type: Number,
      default: 0,
    },
    availibilty: {
      type: Boolean,
      default: 0,
    },
    isAcceptedByAdmin: {
      type: Boolean,
      default: false,
    },
    acceptanceDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("user", UserSchema);
