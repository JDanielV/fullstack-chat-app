import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { updateStoreMessages, fetchConversations } from "../../store/utils/thunkCreators";
import socket from "../../socket";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, fetchConversations } = props;
  const conversation = props.conversation || {};
  const previousActiveConvoRef = useRef();

  useEffect(() => {
    previousActiveConvoRef.current = conversation;
  });

  const previousActiveConvo = previousActiveConvoRef.current;

  // Finds and updates unread messages in current and previous active conversations. 
  // If any found, it updates all unread messages as READ in both convos.
  const findAndUpdateUnreadMessages = () => {
    const unreadMessage = conversation.messages.find(message => !message.readByRecipient && message.senderId !== user.id);
    const previousConvoUnreadMessage = previousActiveConvo && previousActiveConvo.messages ?
      previousActiveConvo.messages.find(message => !message.readByRecipient && message.senderId !== user.id) : null;

    if (unreadMessage || previousConvoUnreadMessage) {
      const arrayOfConvoIds = [];
      unreadMessage && arrayOfConvoIds.push(unreadMessage.conversationId);
      previousConvoUnreadMessage && arrayOfConvoIds.push(previousConvoUnreadMessage.conversationId);
      props.updateStoreMessages(arrayOfConvoIds);
    }
  }

  useEffect(() => {
    if (conversation.messages) {
      findAndUpdateUnreadMessages();
    }
    fetchConversations();
  }, [conversation.id, user.id])

  useEffect(() => {
    if (conversation.messages &&
      conversation.messages[conversation.messages.length - 1].senderId !==
      user.id) {
      socket.emit("update-read-message", {
        ...conversation.messages[conversation.messages.length - 1]
      });
    }
  }, [conversation])


  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              conversationId={conversation.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateStoreMessages: (message) => {
      dispatch(updateStoreMessages(message));
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null)(ActiveChat);
