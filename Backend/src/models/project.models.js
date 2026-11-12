import mongoose , { Schema } from "mongoose"

const projectSchema = new Schema({

    name : {
        type : String,
        required : true,
        trim: true,
      
    },
    description:{
        type: String,
        
    },
    deadline:{
        type:Date,
        default: null
    },
    createdBy : {
        type : Schema.Types.ObjectId, // it will refer to another document.
        ref : "User",
        required : true
    }

}, { timestamps:true}
);

export const Project = mongoose.model("Project", projectSchema)