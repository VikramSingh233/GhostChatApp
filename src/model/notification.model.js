import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
     
    sender:{
        type:String
        
    },
    receiver:{
        type:String
    },
    message:{
        type:String
    },
    sendertime:{
        type:Date
    },
    ProfilePicture:{
        type:String
    },
    receivertime:{
        type:Date
    },
    reply:{
        type:String
    },
    receivername:{
        type:String
    },
    forAddNumber:{
        type:Boolean
    },
    seen:{
        type:Boolean
    }


});

const Notification  = mongoose.models.notifications || mongoose.model("notifications", notificationSchema);

export default Notification;