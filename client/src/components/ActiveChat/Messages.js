import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import socket from "../../socket";

const useStyles = makeStyles(() => ({
  root: {
    height: "85%",
    maxHeight: "85%",
    overflowY: "scroll",
    overflowX: "hidden",
    paddingRight: 41
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, conversationId } = props;
  const [lastSentReadMessage, setLastSentReadMessage] = useState(undefined);

  const setRef = useCallback(node => {
    if (node) {
      console.log("NODE!!", node);
      node.scrollIntoView({ smooth: true })
    }
  }, [])

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
    <Box className={classes.root}>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLastMessage = messages.length - 1 === index;

        return message.senderId === userId ? (
          <SenderBubble isLastMessage={isLastMessage} setRef={setRef} key={index} messageId={message.id} text={message.text} time={time} otherUser={otherUser} lastSentReadMessage={lastSentReadMessage} />
        ) : (
          <OtherUserBubble isLastMessage={isLastMessage} setRef={setRef} key={index} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
