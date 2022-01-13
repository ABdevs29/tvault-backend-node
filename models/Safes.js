const mongoose = require('mongoose');

const SecretSchema = new mongoose.Schema({
    secret: {
        type: String,
        required: true
    }
}, {timestamps:true});

const SafesSchema = new mongoose.Schema({
    safeName: {
        type: String,
        required: true,
    },
    safeOwner: {
        type: String,
        required: true,
    },
    safeType: {
        type: String,
        required: true,
    },
    safeDesc: {
        type: String,
        required: true,
    },
    secrets: [SecretSchema],
    select: {
        type: Boolean,
    }
}, {timestamps: true});

const SafesModel = mongoose.model("safes", SafesSchema);
module.exports = SafesModel;