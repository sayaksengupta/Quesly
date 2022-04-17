import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Loading from "./Loading";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import "../Styles/UserSpaces.scss";
import {
  MdOutlineSentimentVerySatisfied,
  MdOutlineEdit,
  MdMessage,
  MdNotes,
  MdSend,
} from "react-icons/md";
import { FaMicrophone, FaSearch, FaTrash } from "react-icons/fa";
import avatar1 from "../Images/avatar1.png";
import group1 from "../Images/group1.jpg";
import { FaPlus } from "react-icons/fa";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import InputEmoji from "react-input-emoji";
import Button from "@material-ui/core/Button";

let socket;

function UserSpaces() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [callApi, setCallApi] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchRes, setSearchRes] = useState([]);
  const [editSpaceToggle, setEditSpaceToggle] = useState("");
  const [deleteMembers, setDeleteMembers] = useState([]);
  // const [readStats, setReadStats] = useState(true);
  // const [selectedSpaceName, setSelectedSpaceName] = useState("");
  const ENDPOINT = "http://localhost:8000";

  const messagesEndRef = useRef("");

  const getSpaces = async () => {
    const data = location.state.LogUser;
    await axios
      .post("/get-users-spaces", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setSpaces(response.data);
        console.log(response);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert("Space could not be fetched!");
      });
  };

  const searchSpaces = async (e) => {
    let search = e.target.value.toLowerCase();
    let username = location.state.LogUser.username;
    let data = { search, username };
    await axios
      .post("/search-space", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setSearchRes(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    if (e.target.value === "") {
      setSearchRes([]);
    }
  };

  const selectSpace = (space) => {
    setSelectedSpace(space);
  };

  const sendMessage = async (e, space) => {
    e.preventDefault();
    console.log(space);
    const username = location.state.LogUser.username;
    const id = space._id;
    const data = { username, id, message };
    console.log(data);
    if (message) {
      await axios
        .post("/send-message", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response);
          alert("Message Sent!");
        })
        .catch((e) => {
          console.log(e);
          alert("Message Not Sent!");
        });

      socket.emit("sendMessage", message, () => {});

      setMessage("");
    }
  };

  // console.log(selectedSpaceName);

  useEffect(() => {
    getSpaces();
    socket = io(ENDPOINT);
    console.log(socket);
    console.log(selectedSpace.spaceName);

    const username = location.state.LogUser.username;

    socket.on("message", (message) => {
      console.log("message here!");
      setMessages((preValue) => {
        let arr = [...preValue, message].concat(selectedSpace.messages);
        let newUniqueArr = [...new Set(arr)];
        return newUniqueArr;
      });
    });

    if (selectedSpace) {
      socket.emit("join", { username, selectedSpace }, () => {});
    }
  
    // if(selectedSpace){
    // socket.emit("join", { username, selectedSpace }, () => {});
    // setMessages(selectedSpace.messages);
    // }
   
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [selectedSpace]);

  // useEffect(() => {
  
    // if(messages){
    // const newMessages = messages.filter((message) => {
    //   return message.spacename === selectedSpace.spaceName
    // })
    // }
  // }, [selectedSpace]);

  // const deleteMemberStatus = (index, member) => {
  //   console.log(member)
  //   return (
  //     <FaTrash
  //       style={{
  //         marginBottom: "0.25rem",
  //         cursor: "pointer",
  //         color: "#8395a7",
  //       }}
  //       onClick={() =>
  //         setDeleteMembers((preValue) => {
  //           return [...preValue, member];
  //         })
  //       }
  //     />
  //   );
  // };

  const history = useHistory();

  if (sessionStorage.getItem("token")) {
    var token = sessionStorage.getItem("token");
  } else {
    token = localStorage.getItem("token");
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {token ? (
        <>
          <Navbar activeStatus="spaces" />

          {/*  Chat app Starts Here  */}
          <div className="chat_wrapper">
            <div id="chat_container" class="container">
              <div class="row no-gutters">
                <div
                  class="col-md-4 border-right"
                  style={{
                    overflow: "scroll",
                    height: "40rem",
                    overflowX: "hidden",
                  }}
                >
                  <div class="settings-tray">
                    <img
                      class="profile-image"
                      alt=""
                      src={location.state.LogUser.profilePic}
                    />
                    <span
                      style={{
                        paddingLeft: "1rem",
                        fontSize: "1.15rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {location.state.LogUser.username}
                    </span>
                    <span class="settings-tray--right">
                      <i class="material-icons">
                        <MdMessage />
                      </i>
                      <i class="material-icons">
                        <MdNotes />
                      </i>
                    </span>
                  </div>
                  <div class="search-box">
                    <div class="input-wrapper">
                      <i class="material-icons">
                        <FaSearch />
                      </i>
                      <input
                        className="spaces-input"
                        placeholder="Search here"
                        type="text"
                        onChange={searchSpaces}
                      />
                    </div>
                  </div>

                  {searchRes.length == 0
                    ? spaces.map((space) => {
                        const totalMessages = space.messages.length;
                        if (totalMessages > 0) {
                          return (
                            <>
                              <div className="chats_outerwrapper">
                                <div
                                  class="friend-drawer friend-drawer--onhover"
                                  onClick={() => selectSpace(space)}
                                >
                                  <img
                                    class="profile-image"
                                    src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                                    alt=""
                                  />

                                  <div class="text">
                                    <h6>{space.spaceName}</h6>
                                    <p class="text-muted">
                                      {
                                        space.messages[totalMessages - 1]
                                          .message
                                      }
                                    </p>
                                  </div>

                                  <span class="time text-muted small">
                                    13:21
                                  </span>
                                </div>
                              </div>
                              <hr />
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div
                                class="friend-drawer friend-drawer--onhover"
                                onClick={() => selectSpace(space)}
                              >
                                <img
                                  class="profile-image"
                                  src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                                  alt=""
                                />

                                <div class="text">
                                  <h6>{space.spaceName}</h6>
                                  <p class="text-muted"></p>
                                </div>

                                <span class="time text-muted small">13:21</span>
                              </div>
                              <hr />
                            </>
                          );
                        }
                      })
                    : searchRes.map((space) => {
                        const totalMessage = space.messages.length;
                        if (totalMessage > 0) {
                          return (
                            <>
                              <div className="chats_outerwrapper">
                                <div
                                  class="friend-drawer friend-drawer--onhover"
                                  onClick={() => selectSpace(space)}
                                >
                                  <img
                                    class="profile-image"
                                    src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                                    alt=""
                                  />

                                  <div class="text">
                                    <h6>{space.spaceName}</h6>
                                    <p class="text-muted">
                                      {space.messages[totalMessage - 1].message}
                                    </p>
                                  </div>

                                  <span class="time text-muted small">
                                    13:21
                                  </span>
                                </div>
                              </div>
                              <hr />
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div
                                class="friend-drawer friend-drawer--onhover"
                                onClick={() => selectSpace(space)}
                              >
                                <img
                                  class="profile-image"
                                  src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                                  alt=""
                                />

                                <div class="text">
                                  <h6>{space.spaceName}</h6>
                                  <p class="text-muted"></p>
                                </div>

                                <span class="time text-muted small">13:21</span>
                              </div>
                              <hr />
                            </>
                          );
                        }
                      })}
                </div>

                <div class="col-md-8">
                  {selectedSpace.length !== 0 ? (
                    <>
                      <div class="settings-tray">
                        <div class="friend-drawer no-gutters friend-drawer--grey">
                          <img
                            class="profile-image"
                            src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                            alt=""
                          />
                          <div class="text">
                            <h6>{selectedSpace.spaceName}</h6>
                            <p class="text-muted">
                              Add Some Group Description.
                            </p>
                          </div>
                          <span class="settings-tray--right">
                            <i
                              class="material-icons"
                              onClick={() =>
                                setEditSpaceToggle(selectedSpace.spaceName)
                              }
                            >
                              {editSpaceToggle === selectedSpace.spaceName ? (
                                <MdOutlineEdit style={{ color: "#74b9ff" }} />
                              ) : (
                                <MdOutlineEdit />
                              )}
                            </i>
                            <i class="material-icons">
                              <MdNotes />
                            </i>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div class="settings-tray">
                        <div
                          class="friend-drawer no-gutters friend-drawer--grey"
                          style={{ height: "2.75rem" }}
                        >
                          {/* <img
                        class="profile-image"
                        src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                        alt=""
                      />
                      <div class="text">
                        <h6>{selectedSpace.spaceName}</h6>
                        <p class="text-muted">
                          Add Some Group Description.
                        </p>
                      </div> */}
                          {/* <span class="settings-tray--right">
                        <i class="material-icons">
                          <MdMessage />
                        </i>
                        <i class="material-icons">
                          <MdNotes />
                        </i>
                      </span> */}
                        </div>
                      </div>
                    </>
                  )}
                  {editSpaceToggle !== selectedSpace.spaceName ? (
                    selectedSpace.messages ? (
                      <>
                        <div
                          class="chat-panel"
                          style={{ overflowX: "hidden", overflowY: "scroll" }}
                        >
                          {messages
                            .filter((messages) => {
                              return (
                                messages.spacename === selectedSpace.spaceName
                              );
                            })
                            .map((messages) => {
                              if (
                                messages.username ===
                                location.state.LogUser.username
                              ) {
                                return (
                                  <>
                                    <div class="row no-gutters">
                                      <div class="col-md-3 offset-md-9">
                                        {selectedSpace.admin ===
                                        messages.username ? (
                                          <>
                                            <span
                                              style={{ marginLeft: "1.85rem" }}
                                            >
                                              {messages.username}(Admin)
                                            </span>
                                            <div class="chat-bubble chat-bubble--right">
                                              {messages.message}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <span
                                              style={{ marginLeft: "1.85rem" }}
                                            >
                                              {messages.username}
                                            </span>
                                            <div class="chat-bubble chat-bubble--right">
                                              {messages.message}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div class="row no-gutters">
                                      <div class="col-md-3">
                                        <span style={{ marginLeft: "1.85rem" }}>
                                          {messages.username}
                                        </span>
                                        <div class="chat-bubble chat-bubble--left">
                                          {messages.message}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            })}
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="chat-box-tray">
                              <InputEmoji
                                className="spaces-input"
                                value={message}
                                onChange={(e) => setMessage(e)}
                                placeholder="Type your message here..."
                              />
                              <i
                                class="material-icons"
                                onClick={(e) => sendMessage(e, selectedSpace)}
                                style={{
                                  marginRight: "1rem",
                                  paddingBottom: "0.35rem",
                                  marginLeft: "0.5rem",
                                  cursor: "pointer",
                                }}
                              >
                                <MdSend />
                              </i>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          class="chat-panel"
                          style={{
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#fff",
                          }}
                          ref={messagesEndRef}
                        >
                          <div
                            className="default-text"
                            style={{ color: "#b2bec3" }}
                          >
                            <h3 style={{ margin: "0" }}>
                              Create a Space or Select One{" "}
                              <FaPlus
                                style={{
                                  marginBottom: "0.25rem",
                                  marginLeft: "0.5rem",
                                  fontSize: "1.35rem",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  history.push({
                                    pathname: "/spaces",
                                    state: {
                                      loggedInUser: location.state.LogUser,
                                    },
                                  })
                                }
                              />
                            </h3>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <div
                        class="chat-panel"
                        style={{
                          overflow: "hidden",
                          // overflowX: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          background: "#fff",
                          height: "max-content",
                        }}
                        ref={messagesEndRef}
                      >
                        <div
                          className="group-img-container"
                          style={{
                            width: "6.5rem",
                            height: "6.5rem",
                            borderRadius: "50%",
                            border: "2px solid red",
                            marginTop: "2rem",
                            marginBottom: "2rem",
                          }}
                        >
                          <img
                            style={{ width: "100%", borderRadius: "50%" }}
                            src="https://thumbs.dreamstime.com/b/stay-chill-skeleton-cap-cocktail-swim-ring-white-black-background-147343908.jpg"
                          ></img>
                        </div>

                        <Container style={{ width: "92.5%" }}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            multiline
                            maxRows={4}
                            id="description"
                            label="Add Group Description..."
                            name="description"
                            autoComplete="off"
                            autoFocus
                            style={{ width: "100%", marginBottom: "2rem" }}
                          />
                          <h4>
                            Group Members{" "}
                            <FaPlus
                              style={{
                                transform: "scale(0.8)",
                                paddingBottom: "0.2rem",
                                cursor: "pointer",
                              }}
                            />
                          </h4>
                          <div className="dropdown-divider"></div>

                          <div
                            className="wrapper-members"
                            style={{ display: "flex" }}
                          >
                            {selectedSpace.members.map((member, index) => {
                              return (
                                <div
                                  className="member"
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: "2rem",
                                    marginTop: "1rem",
                                    borderRadius: "8px",
                                    padding: "0.5rem",
                                    border: "2px solid #8395a7",
                                    cursor: "pointer",
                                  }}
                                >
                                  <h5 style={{ paddingRight: "0.5rem" }}>
                                    {member}
                                  </h5>
                                  {/* {deleteMemberStatus(index, member)} */}
                                </div>
                              );
                            })}
                          </div>
                        </Container>
                        {/* <div
                          style={{
                            position: "absolute",
                            right: "0",
                            bottom: "0",
                            marginBottom: "2rem",
                            marginRight: "3rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "#70a1ff",
                              color: "#fff",
                            }}
                          >
                            Remove Selected Members
                          </Button>
                        </div> */}

                        <div
                          style={{
                            position: "absolute",
                            right: "2rem",
                            bottom: "0",
                            marginBottom: "2rem",
                            marginLeft: "3rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "#70a1ff",
                              color: "#fff",
                            }}
                            onClick={() => setEditSpaceToggle("")}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        history.push("/login")
      )}
    </>
  );
}

export default UserSpaces;
