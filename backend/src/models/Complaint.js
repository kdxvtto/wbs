import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    location : {
        type : String,
        required : true,
    },
    condition : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        type : [String],
        default : null,
    },
    status : {
        type : String,
        enum : ["pending", "in_progress", "completed"],
        default : "pending",
    }
},{
    timestamps : true
}
)

complaintSchema.index({ createdAt: -1 })

export default mongoose.model("Complaint", complaintSchema);