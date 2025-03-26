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
    receivertime:{
        type:Date
    },
    reply:{
        type:String
    }


});

const Notification  = mongoose.models.notifications || mongoose.model("notifications", notificationSchema);

export default Notification;