import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import "../Styles/Home.css";
import bg from "../Images/bg1.jpg";
import { Button } from "@material-ui/core";
import axios from "axios";
import HeadShake from "react-reveal/HeadShake";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState({
    category: null,
    question: "",
    username: "",
  });

  const [submit, setSubmit] = useState(false);
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [callApi, setCallApi] = useState(false);
  const [user, setUser] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [toggleAnswer, setToggleAnswer] = useState(false);
  const [index, setIndex] = useState("");
  const [index2, setIndex2] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadAnswers, setLoadAnswers] = useState(false);
  const [userAnswer, setUserAnswer] = useState({
    id: "",
    answer: "",
    username: "",
  });

  let name, value;


  const User = JSON.parse(localStorage.getItem("user_info")) || JSON.parse(sessionStorage.getItem("user_info"));


  

  const inputsHandler = (e) => {
    name = e.target.name;
    value = e.target.value;
    setQuery({ ...query, [name]: value, username: user.username });
  };

  const submitHandler = async (e) => {
    const profilePic = user.profilePic;
    e.preventDefault();
    setSubmit(true);
    if (query.category !== null) {
      const { question, category, username } = query;
      const data = { question, category, username, profilePic };

      await axios
        .post("https://quesly-backend.herokuapp.com/post-question", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setCallApi(!callApi);
          alert("Question Posted!");
          console.log(response);
        })
        .catch((e) => {
          alert("Failed to Post Question!");
          console.log(e);
        });
      setQuery({ ...query, question: "" });
    }
  };

  const CategoryCheck = () => {
    if (query.category === null && submit) {
      return (
        <HeadShake>
          <p style={{ paddingTop: "1rem", color: "red" }}>
            Please Select a Category!
          </p>
        </HeadShake>
      );
    } else {
      return null;
    }
  };

  const loadPosts = async () => {
    if(User){
    await axios
      .post("/getQueries-for-user", {
        username : User.username
      })
      .then((response) => {
        setPosts(response.data);

        console.log(response.data);

        // setUserAnswers(response.data.answers);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    }else{
      history.push('/login');
    }
  };

  console.log(answers);

  const inputAnswer = (e, id) => {
    setUserAnswer({
      ...userAnswer,
      answer: e.target.value,
      id: id,
      username: user.username,
      profilePic: user.profilePic
    });
  };

  const submitAnswer = async (index, id) => {
    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer", userAnswer, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setLoadAnswers(!loadAnswers);
        alert("Answer Posted!");
      })
      .catch((e) => {
        console.log(e);
        alert("Could not Post Answer!");
      });
    setUserAnswer({ ...userAnswer, answer: "", id: "" });
  };
  console.log(userAnswer);

  const getUser = async () => {
    if(User){
    await axios
      .post("/getUser", {
        username : User.username
      })
      .then((response) => {
        setUser(response.data);
        console.log(response.data.following);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
    }
  };

  const showAnswerSection = async (index, id) => {
    let i = index;
    setIndex(index);
    setIndex2(i);
    if (index === i) {
      setShowAnswer(true);
      setToggleAnswer(!toggleAnswer);
    }
    // const data = {id};
    // await axios.post('/getAnswers',data,{headers:{"Content-Type" : "application/json"}})
    // .then((response) => {
    //   console.log(response);
    //   alert("Answers Fetched!");
    //   setAnswers(response.data);
    // }).catch((e) => {
    //   console.log(e);
    //   alert("Answer Could Not Be Fetched!");
    // })
  };

  console.log(answers);

  const DeleteAnswer = async (aid) => {
    const data = { aid };
    await axios
      .post("https://quesly-backend.herokuapp.com/delete-answer", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Answer Deleted Successfully!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Could Not Delete Answer!");
      });
  };

  const postUpvote = async (id) => {
    const username = user.username;
    const data = { id, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Question Upvoted!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Question not Upvoted!");
      });
  };

  const postAnswerUpvote = async (qid,aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Answer Upvoted!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer not Upvoted!");
      });
  };

  const removeAnswerUpvote = async (qid,aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/remove-answer-upvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Answer Upvote Removed!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer Upvote not Removed!");
      });
  };

  const unpostUpvote = async (id) => {
    const username = user.username;
    const data = { id, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Question Downvoted!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Question not Downvoted!");
      });
  };

  const postAnswerDownvote = async (qid,aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/post-answer-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Answer Downvoted!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Answer not Downvoted!");
      });
  };

  const removeAnswerDownvote = async (qid,aid) => {
    const username = user.username;
    const data = { qid, aid, username };
    // setUpvoteUser(username);
    // setUpvoteIndex((upvoteIndex) => [...upvoteIndex, index]);

    await axios
      .post("https://quesly-backend.herokuapp.com/remove-answer-downvote", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setLoadAnswers(!loadAnswers);
        alert("Downvote Removed!");
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("Downvote not Removed!");
      });
  };

  const upvoteStatus = (elem) => {
    const Upvoted = elem.upvotes.find((elem) => {
      return elem.username === user.username;
    });

    if (!Upvoted) {
      return (
        <>
          <div id="upvote-wrapper" onClick={() => postUpvote(elem._id)}>
            <i
              style={{
                fontSize: "2rem",
                marginLeft: "1.25rem",
              }}
              class="fa fa-arrow-up"
              aria-hidden="true"
            ></i>
            <p
              style={{
                marginBottom: "0",
                marginLeft: "0.5rem",
                fontWeight: "700",
                marginRight: "1rem",
              }}
            >
              Upvotes {elem.upvotes.length}
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div id="upvote-wrapper" onClick={() => unpostUpvote(elem._id)}>
            <i
              style={{
                fontSize: "2rem",
                marginLeft: "1.25rem",
                color: "#3498db",
              }}
              class="fa fa-arrow-up"
              aria-hidden="true"
            ></i>
            <p
              style={{
                marginBottom: "0",
                marginLeft: "0.5rem",
                fontWeight: "900",
                marginRight: "1rem",
                color: "#3498db",
              }}
            >
              Upvoted {elem.upvotes.length}
            </p>
          </div>
        </>
      );
    }
  };

  const upvoteAnswerStatus = (elem,element) => {
    const Upvoted = element.upvotes.find((element) => {
      return element.username === user.username;
    });

    const Downvoted = element.downvotes.find((element) => {
      return element.username === user.username;
    });

    if (!Upvoted && !Downvoted) {
      return (
        <>
  <div
    style={{
      display: "flex",
      alignItems: "center",
    }}
  > 

    {Upvoted?
    <>
    <i
      style={{ fontSize: "1.25rem", cursor: "pointer",color: "#3498db" }}
      class="fa fa-arrow-up"
      aria-hidden="true"
      onClick={() => postAnswerUpvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        color: "#3498db",
        fontWeight: "bold"
      }}
    >
      {element.upvotes.length}
    </p>
    </>
    :
    <>
    <i
      style={{ fontSize: "1.25rem", cursor: "pointer" }}
      class="fa fa-arrow-up"
      aria-hidden="true"
      onClick={() => postAnswerUpvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        fontWeight: "bold"
      }}
    >
      {element.upvotes.length}
    </p>
    </>
    }

    {Downvoted?
    <>
    <i
      style={{
        fontSize: "1.25rem",
        marginLeft: "1rem",
        cursor: "pointer",
        color: "#3498db"
      }}
      class="fa fa-arrow-down"
      aria-hidden="true"
      onClick={() => postAnswerDownvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        color: "#3498db",
        fontWeight: "bold"
      }}
    >
      {element.downvotes.length}
    </p>
    </>
    : 
    <>
    <i
      style={{
        fontSize: "1.25rem",
        marginLeft: "1rem",
        cursor: "pointer",
      }}
      class="fa fa-arrow-down"
      aria-hidden="true"
      onClick={() => postAnswerDownvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        fontWeight: "bold"
      }}
    >
      {element.downvotes.length}
    </p>
    </>
    }
  </div>
        </>
      );
    } else {
      return (
        <>
    <div
    style={{
      display: "flex",
      alignItems: "center",
    }}
  >
  {Upvoted?
  <>
    <i
      style={{ fontSize: "1.25rem", cursor: "pointer",color: "#3498db" }}
      class="fa fa-arrow-up"
      aria-hidden="true"
      onClick={() => removeAnswerUpvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        color: "#3498db",
        fontWeight: "bold"
      }}
    >
      {element.upvotes.length}
    </p>
  </>
  :
  <>
  <i
      style={{ fontSize: "1.25rem", cursor: "pointer"}}
      class="fa fa-arrow-up"
      aria-hidden="true"
      onClick={() => removeAnswerUpvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        fontWeight: "bold"
      }}
    >
      {element.upvotes.length}
    </p>
  </>
  }
  {Downvoted? 

    <>
    <i
      style={{
        fontSize: "1.25rem",
        marginLeft: "1rem",
        cursor: "pointer",
        color: "#3498db",
      }}
      class="fa fa-arrow-down"
      aria-hidden="true"
      onClick={() => removeAnswerDownvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        color: "#3498db",
        fontWeight: "bold"
      }}
    >
      {element.downvotes.length}
    </p>
    </>
    :
    <>
    <i
      style={{
        fontSize: "1.25rem",
        marginLeft: "1rem",
        cursor: "pointer",
      }}
      class="fa fa-arrow-down"
      aria-hidden="true"
      onClick={() => removeAnswerDownvote(elem._id,element._id)}
    ></i>
    <p
      style={{
        margin: "0",
        paddingLeft: "0.5rem",
        fontWeight: "bold"
      }}
    >
      {element.downvotes.length}
    </p>
    </>}

  </div>
        </>
      );
    }
  };

  const followUser = async (user, follow_user) => {
    const data = { user, follow_user };
    await axios
      .post("https://quesly-backend.herokuapp.com/follow-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setCallApi(!callApi);
        alert(response.data.message);
      })
      .catch((e) => {
        alert("Could Not Follow User!");
      });
  };

  const unfollowUser = async (user, unfollow_user) => {
    const data = { user, unfollow_user };
    await axios
      .post("https://quesly-backend.herokuapp.com/unfollow-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setCallApi(!callApi);
        alert(response.data.message);
      })
      .catch((e) => {
        alert("Could Not unfollow User!");
      });
  };

  const followStat = (user, username) => {
    if (user.following) {
      const Followed = user.following.find((followedUser) => {
        return followedUser.username === username;
      });
      if (user.username === username) {
        return null;
      } else {
        if (Followed === undefined) {
          return (
            <p
              onClick={() => followUser(user.username, username)}
              style={{
                margin: "0",
                paddingLeft: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#2c3e50",
              }}
            >
              Follow
            </p>
          );
        } else {
          return (
            <p
              onClick={() => unfollowUser(user.username, username)}
              style={{
                margin: "0",
                paddingLeft: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#f19066",
              }}
            >
              Following
            </p>
          );
        }
      }
    }
  };

  const history = useHistory();

  if (sessionStorage.getItem("token")) {
    var token = sessionStorage.getItem("token");
  } else {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    getUser();
  }, [callApi]);

  useEffect(() => {
    loadPosts();
  }, [callApi || loadAnswers]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {token ? (
        <>
          <Navbar activeStatus="home" />

          <div
            style={{
              background: "#f1f2f2",
              minHeight: "100vh",
              maxHeight: "max-content",
            }}
            class="container-fluid"
          >
            <div id="home-wrapper" class="row">
              <div id="dummy" class="col-0 col-md-3 col-lg-3"></div>
              <div id="questionWrapper" class="col-12 col-md-6 col-lg-6">
                <div id="user_info_wrapper">
                  <div className="question-box">
                    <div id="inner_question">
                      <div id="user_info">
                        <div id="user_img_container">
                          <img id="user_img" src={user.profilePic} />
                        </div>
                        <h4
                          style={{
                            marginBottom: "0",
                            paddingLeft: "1rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.username}
                        </h4>
                      </div>

                      <textarea
                        placeholder="Add a Question..."
                        value={query.question}
                        name="question"
                        onChange={inputsHandler}
                      />
                      <div id="button_container">
                        <Button
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                          id="question_post"
                          variant="outlined"
                        >
                          Select Category
                        </Button>
                        <Button
                          onClick={submitHandler}
                          id="question_post"
                          variant="outlined"
                        >
                          Post A Question
                        </Button>
                      </div>
                      <CategoryCheck />
                    </div>
                  </div>
                </div>
                {posts.map((elem, index) => {
                  return (
                    <div id="posts" key={index}>
                      <div id="post-wrapper">
                        <div id="user-outer">
                          <div id="user_info">
                            <div id="user_img_container">
                              <img id="user_img" src={elem.profilePic} />
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {" "}
                                <Link
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                  to={{
                                    pathname: "/visiting-profile",
                                    state: { User: user, visitingUser: elem },
                                  }}
                                >
                                  <h4
                                    style={{
                                      marginBottom: "0",
                                      paddingLeft: "1rem",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {elem.username}
                                  </h4>
                                </Link>
                                {followStat(user, elem.username)}
                              </div>
                              <p
                                style={{
                                  margin: "0",
                                  paddingLeft: "1rem",
                                  fontSize: "1rem",
                                  textTransform: "capitalize",
                                }}
                              >
                                {elem.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div id="question-wrapper">
                          <p>{elem.question}</p>
                        </div>
                      </div>
                      <div
                        style={{ margin: "0" }}
                        class="dropdown-divider"
                      ></div>

                      <div id="reaction-bar">
                        <div id="inner-reaction-bar">
                          {upvoteStatus(elem)}

                          <div
                            onClick={() => showAnswerSection(index, elem._id)}
                            id="answer-wrapper"
                          >
                            <i
                              style={{
                                fontSize: "2rem",
                                marginLeft: "1.25rem",
                              }}
                              class="fa fa-comment-o"
                              aria-hidden="true"
                            ></i>
                            <p
                              style={{
                                marginBottom: "0",
                                marginLeft: "0.5rem",
                                fontWeight: "700",
                                marginRight: "1.25rem",
                              }}
                            >
                              Answers {elem.answers.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{ margin: "0" }}
                        class="dropdown-divider"
                      ></div>

                      {index == index2 && showAnswer ? (
                        <>
                          <div id="answers-wrapper" key={index}>
                            <div id="add-answer">
                              <div id="answer_user_info">
                                <div id="user_img_container">
                                  <img id="user_img" src={user.profilePic} />
                                </div>

                                <input
                                  id="add_answer"
                                  placeholder="Add an answer..."
                                  value={userAnswer.answer}
                                  onChange={(e) => {
                                    inputAnswer(e, elem._id);
                                  }}
                                ></input>

                                <Button
                                  style={{
                                    position: "relative",
                                    marginRight: "4rem",
                                  }}
                                  onClick={() => submitAnswer(index, elem._id)}
                                  color="primary"
                                  variant="contained"
                                >
                                  Add Answer
                                </Button>
                                <i
                                  onClick={() => setShowAnswer(false)}
                                  style={{
                                    marginBottom: "1.5rem",
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                  }}
                                  class="fa fa-times"
                                  aria-hidden="true"
                                ></i>
                              </div>
                            </div>

                            <div
                              style={{ marginBottom: "0" }}
                              class="dropdown-divider"
                            ></div>

                            <div id="answer_section">
                              {elem.answers.map((element, i) => {
                                return (
                                  <div style={{ marginTop: "0.8rem" }}>
                                    <div
                                      id="user_info"
                                      style={{
                                        height: "3rem",
                                        justifyContent: "space-between",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          height: "100%",
                                          alignItems: "center",
                                          marginLeft: "1.5rem",
                                        }}
                                      >
                                        <div id="answer_user_img_container">
                                          <img
                                            id="answer_user_img"
                                            src={element.profilePic}
                                          />
                                        </div>
                                        <h5
                                          style={{
                                            marginBottom: "0",
                                            paddingLeft: "0.5rem",
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {element.username}
                                        </h5>
                                      </div>
                                      {user.username === element.username || elem.username === user.username? (
                                        <>
                                          <h6
                                            onClick={() =>
                                              DeleteAnswer(element._id)
                                            }
                                            style={{
                                              padding: "1rem",
                                              color: "#636e72",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Delete Answer
                                          </h6>
                                        </>
                                      ) : null}
                                    </div>

                                    <div id="user_answer" key={index}>
                                      <p style={{ marginBottom: "0.5rem" }}>
                                        {element.answer}
                                      </p>
                                      {upvoteAnswerStatus(elem,element)}
                                    </div>
                                    <div
                                      style={{ marginBottom: "0" }}
                                      class="dropdown-divider"
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* <div style={{margin:"0"}} class="dropdown-divider"></div> */}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div id="dummy" class="col-0 col-md-3 col-lg-3"></div>
            </div>

            <div
              class="modal fade"
              id="exampleModalCenter"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">
                      Please Select Your Category
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form id="category_form">
                      <div class="form-check">
                        <label
                          for="health"
                          class="form-check-input"
                          value="health"
                        >
                          Health & Fitness
                        </label>
                        <input
                          type="radio"
                          name="category"
                          onChange={inputsHandler}
                          value="health"
                          class="form-control shadow-none"
                          id="health"
                        />
                      </div>

                      <div class="form-check">
                        <label
                          for="business"
                          class="form-check-input"
                          value="business"
                        >
                          Business & Marketing
                        </label>
                        <input
                          type="radio"
                          name="category"
                          onChange={inputsHandler}
                          value="business"
                          class="form-control shadow-none"
                          id="business"
                        />
                      </div>

                      <div class="form-check">
                        <label
                          for="lifestyle"
                          class="form-check-input"
                          value="lifestyle"
                        >
                          Lifestyle
                        </label>
                        <input
                          type="radio"
                          name="category"
                          onChange={inputsHandler}
                          value="lifestyle"
                          class="form-control shadow-none"
                          id="lifestyle"
                        />
                      </div>

                      <div class="form-check">
                        <label
                          for="education"
                          class="form-check-input"
                          value="education"
                        >
                          Education
                        </label>
                        <input
                          type="radio"
                          name="category"
                          onChange={inputsHandler}
                          value="education"
                          class="form-control shadow-none"
                          id="education"
                        />
                      </div>

                      <div class="form-check">
                        <label
                          for="sports"
                          class="form-check-input"
                          value="trending"
                        >
                          Trending
                        </label>
                        <input
                          type="radio"
                          name="category"
                          onChange={inputsHandler}
                          value="trending"
                          class="form-control shadow-none"
                          id="trending"
                        />
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
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

export default Home;
