import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { sendFriendRequest, acceptFriendRequest, getRelationshipStatus, getIncomingRequests } from '../controllers/friendController.js';

const router = express.Router();

router.post('/request', isAuthenticated, sendFriendRequest);
router.post('/accept', isAuthenticated, acceptFriendRequest);
router.get('/status', isAuthenticated, getRelationshipStatus);
router.get('/requests', isAuthenticated, getIncomingRequests);

export default router;
