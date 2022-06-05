const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifSchema = new Schema(
    {
        isRead: {
            type: Boolean,
            default: false
        },
        notifName: {
            type: String
        },
        notifType: {
            type: String
        },
        notifDesc: {
            type: String
        },
        notifBy: {
            type: String
        },
        notifFor: {
            type: String
        },
        notifIcon: {
            type: String
        },
        notifDate: {
            type: Date
        }
    }
);

const Notif = mongoose.model('Notif', notifSchema);
module.exports = Notif;