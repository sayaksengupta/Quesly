import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import bg from "../Images/bg1.jpg";
import "../Styles/Profile.css";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import avatar1 from "../Images/avatar1.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Profile() {
  const User =
    JSON.parse(localStorage.getItem("user_info")) ||
    JSON.parse(sessionStorage.getItem("user_info"));

  const username = User.username;

  const storage = getStorage();

  const [user, setUser] = useState("");
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callApi, setCallApi] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(false);

  const getUser = async () => {
    await axios
      .post("https://quesly-backend.herokuapp.com/getUser", {
        username: username,
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
        console.log(response.data.following);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUserQueries = async () => {
    const data = {
      username: user.username,
    };
    await axios
      .post("https://quesly-backend.herokuapp.com/getQueries-by-user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setUserQueries(response.data);
        setCallApi(!callApi);
        console.log(response.data);
        // setQuery({ ...query, username: user.username });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleProfileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  const handleProfileUpload = () => {
    const storageRef = ref(storage, `profileImages/${profileImg.name}`);
    setLoader(true);
    uploadBytes(storageRef, profileImg).then((snapshot) => {
      if (snapshot) {
        console.log(snapshot);
        setLoader(false);
        alert("Profile Picture Changed Successfully!");
        getDownloadURL(ref(storage, `profileImages/${profileImg.name}`)).then(
          (url) => {
            axios.patch(`https://quesly-backend.herokuapp.com/updateUser/${user._id}`, {
              profilePic: url,
            })
              .then((res) => {
                console.log(res);
                window.location.reload(true);
              })
              .catch((e) => {
                console.log(`Could not save image Url. ${e}`);
              });
          }
        );
      }
    });
  };



  //   if(userQueries){
  //     const totalUpvotes = userQueries.reduce((elem,accum) => {
  //         return accum += elem.upvotes.length;
  //     })
  //     console.log(totalUpvotes);
  //   }

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
          <Navbar activeStatus="profile" />

          {user ? (
            <>
              <div
                style={{
                  background: "#f1f2f2",
                  minHeight: "100vh",
                  maxHeight: "max-content",
                }}
                class="container-fluid"
              >
                <div className="container emp-profile  p-5">
                 
                    <div className="row">
                      <div className="col-md-4">
                        <img
                          src={user.profilePic}
                          style={{ borderRadius: "50%", width: "8rem",height:"8rem", objectFit:"cover" }}
                          width="50%"
                          className="m-3"
                        />
                        <span onClick={() => setProfileModal(true)}>
                          <i
                            id="editProfilePic"
                            style={{
                              fontSize: "1.6rem",
                              position: "relative",
                              bottom: "-3.25rem",
                            }}
                            class="fa fa-pencil-square-o"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>

                      {profileModal ? (
                        <div className="profileModal">
                          <div className="profileTitle">
                            <h4>Upload Profile Picture</h4>
                            <i
                              class="fa fa-times"
                              aria-hidden="true"
                              style={{
                                fontSize: "1.55rem",
                                color: "#808080",
                                cursor: "pointer",
                              }}
                              onClick={() => setProfileModal(false)}
                            ></i>
                          </div>
                          <hr style={{ width: "100%" }}></hr>

                          <div className="profileUpload">
                            <input type="file" onChange={handleProfileChange} />
                            {loader ? <div class="loader"></div> : null}
                          </div>

                          <div className="submitProfile">
                            <button
                              className="btn btn-primary"
                              style={{ width: "8rem" }}
                              onClick={handleProfileUpload}
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <div className="col-md-6">
                        <div className="profile-head">
                          <h5>
                            {user.firstname} {user.lastname}
                          </h5>
                          <h6>Web Developer</h6>

                          <section id="tabs" className="project-tab">
                            <ul className="nav nav-tabs" role="tablist">
                              <li className="nav-item">
                                <a
                                  className="nav-link active"
                                  id="home-tab"
                                  data-toggle="tab"
                                  href="#home"
                                  role="tab"
                                >
                                  About
                                </a>
                              </li>
                              <li className="nav-item">
                                {/* <a onClick={getUserQueries} className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab">Timeline</a> */}
                              </li>
                            </ul>
                          </section>
                        </div>
                      </div>

                      {/* <div className="col-md-2">
                            <input type="submit" className="profile-edit-btn" name="btnAddMore" value="Edit Profile"></input>
                        </div> */}
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="profile-work">
                          <p style={{ fontWeight: "bold" }}>
                            Selected Categories
                          </p>
                          {user.category.map((elem) => {
                            return (
                              <>
                                <Link
                                  style={{ textTransform: "capitalize" }}
                                  to={"/" + elem}
                                  target="_sayak"
                                >
                                  {elem}
                                </Link>{" "}
                                <br />
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-md-8 pl-5 about-info">
                        <div
                          className="tab-content profile-tab"
                          id="myTabContent"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="home"
                            role="tabpanel"
                            aria-labelledby="home-tab"
                          >
                            <div className="row">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Username
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label>{user.username}</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Name
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  {user.firstname} {user.lastname}
                                </label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Email
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label>{user.email}</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Followers
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label style={{ cursor: "pointer" }}>
                                  {user.followers.length}
                                </label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label style={{ fontWeight: "bold" }}>
                                  Following
                                </label>
                              </div>
                              <div className="col-md-6">
                                <label style={{ cursor: "pointer" }}>
                                  {user.following.length}
                                </label>
                              </div>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade"
                            id="profile"
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                          >
                            <div className="row">
                              <div className="col-md-6">
                                <label>Questions Posted</label>
                              </div>
                              <div className="col-md-6">
                                <label>{userQueries.length}</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Question Upvotes</label>
                              </div>
                              <div className="col-md-6">
                                <label>35$/hr</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Answers Posted</label>
                              </div>
                              <div className="col-md-6">
                                <label>100</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>English Level</label>
                              </div>
                              <div className="col-md-6">
                                <label>Fluent</label>
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>Availability</label>
                              </div>
                              <div className="col-md-6">
                                <label>6 months</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        history.push("/login")
      )}
    </>
  );
}

export default Profile;
