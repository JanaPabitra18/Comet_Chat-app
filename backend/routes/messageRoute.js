import express from 'express';
import { sendMessage, fetchMessages, deleteConversation } from '../controllers/messageController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
const router = express.Router();
router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/:id').get(isAuthenticated, fetchMessages);
router.route('/delete/:id').delete(isAuthenticated, deleteConversation);
export default router;