import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
Name: {
        type: String,
        required: true,
        
    },

    Password: {
        type: String,
        required: true,
    },

    MobileNumber:{
        type: String,
        required: true,
        unique: true
    },
    AddedNumbers:[{
        type: String,
        required: true,
        
    }],
    BlockedNumbers:[{
        type: String,
        required: true,
        
    }],
    RecentlyDeletedNumbers:[{
        type: String,
        required: true,
    }],
    ProfilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    ImpContacts:[{
        type: String
    }],
    ProfilePicturePublicId:{
        type: String
    },
        
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User  = mongoose.models.users || mongoose.model("users", userSchema);

export default User;