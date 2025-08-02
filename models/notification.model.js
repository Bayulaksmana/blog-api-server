import mongoose, { Schema } from "mongoose";

const notificationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ["like", "comment", "reply"],
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    notification_for: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users_profile'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users_profile'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'comment'
    },
    replied_on_comment:{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    },
    seen: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

export default mongoose.model("notification", notificationSchema)