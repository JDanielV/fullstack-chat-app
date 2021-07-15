import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  notificationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  notification: {
    height: 20,
    width: "fitContent",
    padding: 7,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  notificationText: {
    fontSize: 12,
    fontWeight: 600
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, activeConversation, userId } = props;

  let unreadMessagesCount = conversation.messages.filter(message => !message.readByRecipient && message.senderId !== userId).length;

  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadMessagesCount > 0 && activeConversation !== conversation.otherUser.username &&
        <Box className={classes.notificationWrapper}>
          <Box className={classes.notification}>
            <Typography className={classes.notificationText}>
              {unreadMessagesCount}
            </Typography>
          </Box>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
