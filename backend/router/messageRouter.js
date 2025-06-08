// backend/router/messageRouter.js
import express from 'express';
import { 
  getAllMessages,
  sendMessage,
  deleteMessage,
  updateMessage
} from '../controller/messageController.js';

const router = express.Router();

// Message routes
router.post('/send', sendMessage);
router.get('/getall', getAllMessages);
router.delete('/message/:id', deleteMessage);
router.put('/message/:id', updateMessage);

export default router;
