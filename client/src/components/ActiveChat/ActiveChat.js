import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { updateStoreMessages } from "../../store/utils/thunkCreators";

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
  const { user } = props;
  const conversation = props.conversation || {};

  const markMessageAsRead = (message) => {
    const newMessage = {
      ...message,
      readByRecipient: true
    }
    props.updateStoreMessages(newMessage);
  };

  useEffect(() => {
    console.log("useEffect triggered");
    if (conversation.messages) {
      for (let i = 0; i < conversation.messages.length; i++) {
        if (!conversation.messages[i].readByRecipient && user.id !== conversation.messages[i].senderId) {
          markMessageAsRead(conversation.messages[i]);
        }
      }
    }
  }, [conversation, user.id])

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
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null)(ActiveChat);
