import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      receiver: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
        expires: 86400, // Message will be deleted exactly 24 hours after creation
      },
    },
  ],
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
