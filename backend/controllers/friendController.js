import FriendRequest from '../models/friendRequestModel.js';
import Conversation from '../models/conversationModel.js';

// POST /api/v1/friends/request { to }
export const sendFriendRequest = async (req, res) => {
  try {
    const from = req.id;
    const { to } = req.body;
    if (!to) return res.status(400).json({ message: 'Missing recipient' });
    if (String(from) === String(to)) return res.status(400).json({ message: "Can't send request to yourself" });

    let fr = await FriendRequest.findOne({ from, to });
    if (!fr) {
      fr = await FriendRequest.create({ from, to, status: 'pending' });
    }
    return res.status(200).json({ message: 'Request sent', request: fr });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate (from,to) unique index
      return res.status(200).json({ message: 'Request already exists', request: await FriendRequest.findOne({ from: req.id, to: req.body.to }) });
    }
    return res.status(500).json({ message: 'Failed to send request' });
  }
};

// POST /api/v1/friends/accept { from }
export const acceptFriendRequest = async (req, res) => {
  try {
    const to = req.id;
    const { from } = req.body;
    if (!from) return res.status(400).json({ message: 'Missing requester' });

    const fr = await FriendRequest.findOneAndUpdate(
      { from, to, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    );
    if (!fr) return res.status(404).json({ message: 'Pending request not found' });

    // Ensure a conversation exists between the two
    const participants = [from, to];
    let convo = await Conversation.findOne({ participants: { $all: participants, $size: 2 } });
    if (!convo) {
      convo = await Conversation.create({ participants, messages: [] });
    }

    return res.status(200).json({ message: 'Friend request accepted', request: fr, conversationId: convo._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to accept request' });
  }
};

// GET /api/v1/friends/status?userId=...
export const getRelationshipStatus = async (req, res) => {
  try {
    const me = req.id;
    const other = req.query.userId;
    if (!other) return res.status(400).json({ message: 'Missing userId' });

    const fr = await FriendRequest.findOne({ $or: [ { from: me, to: other }, { from: other, to: me } ] });
    let status = 'none';
    let direction = null; // 'outgoing' | 'incoming' | null
    if (fr) {
      status = fr.status;
      if (fr.status === 'pending') {
        direction = String(fr.from) === String(me) ? 'outgoing' : 'incoming';
      }
    }

    // Consider accepted if conversation already exists
    if (status !== 'accepted') {
      const convo = await Conversation.findOne({ participants: { $all: [me, other], $size: 2 } });
      if (convo) status = 'accepted';
    }

    return res.status(200).json({ status, direction });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get status' });
  }
};

// GET /api/v1/friends/requests (incoming pending)
export const getIncomingRequests = async (req, res) => {
  try {
    const me = req.id;
    const list = await FriendRequest.find({ to: me, status: 'pending' }).populate('from', 'fullname username email avatar profilePhoto');
    return res.status(200).json({ requests: list });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch requests' });
  }
};
