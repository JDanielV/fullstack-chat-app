import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import socket from "../../socket";

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId } = props;

  const [lastSentReadMessage, setLastSentReadMessage] = useState(undefined);

  useEffect(() => {
    setLastSentReadMessage(messages.filter(message =>
      message.senderId === userId && message.readByRecipient).slice(-1)[0]);

    // Listens for when latest message has been read by recipient, and updates
    // local state & UI for "last read message" accordingly in real time 
    socket.on("receive-read-message", (message) => {
      if (message.senderId === userId &&
        message.conversationId === conversationId) {
        setLastSentReadMessage(message);
      }
    })
  }, [])

  useEffect(() => {
    setLastSentReadMessage(messages.filter(message =>
      message.senderId === userId && message.readByRecipient).slice(-1)[0]);

  }, [conversationId, messages, userId])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");


        return message.senderId === userId ? (
          <SenderBubble key={message.id} messageId={message.id} text={message.text} time={time} otherUser={otherUser} lastSentReadMessage={lastSentReadMessage} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
