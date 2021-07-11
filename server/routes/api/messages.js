const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {

  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {

      // however, we do need to check if the sender of the message (senderId) is actually
      // one of the users in the conversation (user1Id or user2Id)
      let conversation = await Conversation.findConversation(
        senderId,
        recipientId
      );

      if (conversation.id === conversationId) {
        const message = await Message.create({ senderId, text, conversationId, readByRecipient: false });
        return res.json({ message, sender });
      }
      else {
        return res.sendStatus(403);
      }

    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      readByRecipient: false,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// updates messages from unread to read, if message exists and is unread
router.put("/", async (req, res, next) => {

  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { id, senderId, readByRecipient } = req.body;

    // confirm message exists by finding it
    let message = await Message.findOne({
      where: { id, senderId }
    });

    // perform update operation if message is found & unread
    if (message && !message.readByRecipient) {
      Message.update({
        readByRecipient: readByRecipient
      },
        {
          where: { id, senderId }
        })
      return res.json({ message });
    }
    else {
      return res.sendStatus(403);
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
