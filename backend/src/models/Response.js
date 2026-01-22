import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    idComplaint : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Complaint"
    },
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : ["pending", "in_progress", "completed"],
        default : "pending",
    },
    progress : {
        type : Number,
        default : 0,
    },
    response : {
        type : String,
        required : true,
    },
},{
    timestamps: true
}
);
responseSchema.index({ idComplaint: 1 })
responseSchema.index({ idUser: 1 })
responseSchema.index({ createdAt: -1 })

export default mongoose.model("Response", responseSchema);