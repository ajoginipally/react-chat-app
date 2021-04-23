import React, { useState, useEffect, useRef } from "react";

import {
  Grid,
  Typography,
  makeStyles,
  TextField,
  IconButton,
  Box,
  Tooltip,
  Avatar,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import FaceIcon from "@material-ui/icons/Face";
import AndroidIcon from "@material-ui/icons/Android";

import "./App.css";
import { v4 as uuid } from "uuid";
import { cpuUsage } from "node:process";

const cardStyles = makeStyles({
  root: {
    minWidth: 700,
    maxWidth: 700,
    height: "100vh",
    boxShadow: "0 0 8px 0 #dbdbdb",
    backgroundColor: "#f9f9f9",
  },
  background: {
    backgroundColor: "#DCDCDC",
  },
  window: {
    height: "85vh",
    overflowX: "hidden",
    overflowY: "scroll",
  },
  header: {
    height: "7vh",
    boxShadow: "0 -2px 8px 0 #dbdbdb",
  },
  headerTitle: {
    marginLeft: "1em",
    paddingTop: ".5em",
  },
  intro: {
    paddingTop: ".5em",
    paddingBottom: ".5em",
    paddingLeft: ".5em",
    paddingRight: ".5em",
    border: "1px solid #478FE5",
    borderRadius: "20px",
    marginTop: ".5em",
    color: "white",
    maxWidth: "250px",
    backgroundColor: "#478FE5",
  },
  user: {
    paddingTop: ".3em",
    paddingBottom: ".3em",
    paddingLeft: ".3em",
    paddingRight: ".3em",
    border: "1px solid #297142",
    borderRadius: "3px",
    marginRight: ".5em",
    color: "white",
    maxWidth: "350px",
    backgroundColor: "#297142",
    wordBreak: "break-word",
  },
  bot: {
    paddingTop: ".3em",
    paddingBottom: ".3em",
    paddingLeft: ".3em",
    paddingRight: ".3em",
    border: "1px solid #dbdbdb",
    borderRadius: "3px",
    marginLeft: ".5em",
    maxWidth: "350px",
    backgroundColor: "#dbdbdb",
    wordBreak: "break-word",
  },
  message: {
    marginTop: "15px",
    marginLeft: "5px",
    marginRight: "5px",
  },
  articles: {
    marginTop: ".5em",
  },
});

function App() {
  const cardClasses = cardStyles();
  const messagesInit: any = [
    {
      id: uuid(),
      message: "",
      type: "bot",
      date: new Date(),
      command: "",
    },
  ];

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(messagesInit);

  const endRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (endRef && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    fetch("/v1/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data["messages"]);
      });
  }, []);

  const sendMessage = () => {
    let userMessage = {
      id: uuid(),
      message: message,
      type: "user",
      date: new Date(),
      command: "message",
    };

    setMessages((prevState: any) => {
      return [...prevState, userMessage];
    });

    setMessage("");

    if (message.includes("anime")) {
      fetch("/v1/messages/commands/anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevState: any) => {
            return [...prevState, data["botResponse"]];
          });
        });
    } else if (message.includes("articles")) {
      fetch("/v1/messages/commands/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevState: any) => {
            return [...prevState, data["botResponse"]];
          });
        });
    } else if (message.includes("drink")) {
      fetch("/v1/messages/commands/drink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevState: any) => {
            return [...prevState, data["botResponse"]];
          });
        });
    } else {
      fetch("/v1/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevState: any) => {
            return [...prevState, data["botResponse"]];
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const SendButton = () => (
    <Tooltip title="ENTER to send" placement="top">
      <span>
        <IconButton disabled={!message} onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Grid container className={cardClasses.background} justify="center">
      <Grid item>
        <Box className={cardClasses.root}>
          <Grid container justify="center" alignItems="stretch">
            <Grid xs={12} item>
              <Box className={cardClasses.header}>
                <Grid
                  container
                  alignItems="center"
                  className={cardClasses.headerTitle}
                  spacing={1}
                >
                  <Grid item>
                    <Avatar
                      alt="Rodney Copperbottom"
                      src={process.env.PUBLIC_URL + "/Slice.jpg"}
                    />
                  </Grid>
                  <Grid item>
                    <Typography display="inline" variant="h6">
                      Rodney Copperbottom
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid xs={12} item>
              <Box className={cardClasses.window}>
                <Grid container direction="row" justify="center">
                  <Typography className={cardClasses.intro}>
                    Welcome to the chat!
                  </Typography>
                </Grid>
                <Grid container direction="row">
                  {messages.map((item: any) => (
                    <Grid
                      container
                      justify={
                        item["type"] === "user" ? "flex-end" : "flex-start"
                      }
                      item
                      xs={12}
                      className={cardClasses.message}
                      key={item["id"]}
                    >
                      {item["type"] === "bot" && <AndroidIcon />}
                      <Typography
                        component={"span"}
                        className={
                          item["type"] === "user"
                            ? cardClasses.user
                            : cardClasses.bot
                        }
                        variant="body1"
                      >
                        {item["command"] === "articles" && (
                          <Typography component={"span"}>
                            <Typography variant="body1">
                              Here you go, the articles I found for you are:
                            </Typography>
                            <ol>
                              {item["message"].map((article: any) => (
                                <li className={cardClasses.articles}>
                                  <Grid container direction="column">
                                    <Grid item>
                                      <Typography
                                        color="primary"
                                        variant="body1"
                                      >
                                        {article["title"]}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography variant="caption">
                                        {article["excerpt"]}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </li>
                              ))}
                            </ol>
                          </Typography>
                        )}

                        {item["command"] === "anime" && (
                          <Typography component={"span"}>
                            <Typography color="primary">
                              Anime:{" "}
                              <Typography color="textPrimary" component="span">
                                {item["message"]["anime"]}
                              </Typography>
                            </Typography>
                            <Typography color="primary">
                              Character:{" "}
                              <Typography color="textPrimary" component="span">
                                {item["message"]["character"]}
                              </Typography>
                            </Typography>
                            <Typography color="primary">
                              Quote:{" "}
                              <Typography color="textPrimary" component="span">
                                {item["message"]["quote"]}
                              </Typography>
                            </Typography>
                          </Typography>
                        )}

                        {item["command"] === "message" && item["message"]}

                        {item["command"] === "drink" && (
                          <Typography component={"span"}>
                            <Typography color="primary">
                              Drink:{" "}
                              <Typography color="textPrimary" component="span">
                                {item["message"]["drink"]}
                              </Typography>
                            </Typography>
                            <img
                              src={item["message"]["image"]}
                              width="100"
                              height="100"
                              alt="drink"
                            ></img>
                            <Typography component={"span"}>
                              <ul>
                                {item["message"]["ingredients"].map(
                                  (ingredient: any) => (
                                    <li>{ingredient}</li>
                                  )
                                )}
                              </ul>
                            </Typography>
                          </Typography>
                        )}
                      </Typography>
                      {item["type"] === "user" && <FaceIcon />}
                    </Grid>
                  ))}
                </Grid>
                <div ref={endRef}></div>
              </Box>
            </Grid>
            <Grid xs={11} item>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                value={message}
                onKeyDown={(event) => {
                  if (event["key"] === "Enter") {
                    sendMessage();
                  }
                }}
                onChange={(event) => setMessage(event.target.value)}
                InputProps={{ endAdornment: <SendButton /> }}
              ></TextField>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
