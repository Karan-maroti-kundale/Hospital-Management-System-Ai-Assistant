// backend/controller/messageController.js
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { Message } from '../models/messageSchema.js';
import { ErrorHandler } from '../middlewares/error.js';

// Create new message (contact form)
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const newMessage = await Message.create({
    firstName,
    lastName,
    email,
    phone,
    message
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage
  });
});

// Get all messages (admin only)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    data: messages
  });
});

// Delete message (admin only)
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully"
  });
});

// Update message (admin only)
export const updateMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  if (!req.body.message) {
    return next(new ErrorHandler("Please provide message content", 400));
  }

  message.message = req.body.message;
  await message.save();

  res.status(200).json({
    success: true,
    message: "Message updated successfully",
    data: message
  });
});