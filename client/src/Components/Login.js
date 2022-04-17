import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import { ClickAwayListener } from "@material-ui/core";
import "../Styles/Login.css";
import bg1 from "../Images/bg1.jpg";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../Firebase";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Quesly
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  login: {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%,-50%)",
    padding: "2rem",
    left: "50%",
    background: "rgba(255, 255, 255, 0.904)",
    borderRadius: "10px",
    boxShadow: " 0px 2px 48px -4px rgba(0,0,0,0.73)",
    overflow: "hidden",
  },
}));

export default function Login() {
  const history = useHistory();

  const [remember, setRemember] = useState(false);
  const [authToken, setAuthToken] = useState("");

  const [loguser, setLogUser] = useState({
    email: "",
    password: "",
  });

  let name, value;

  const inputsHandler = (e) => {
    name = e.target.name;
    value = e.target.value;

    setLogUser({ ...loguser, [name]: value });
  };

  const signIn = async (e) => {
    e.preventDefault();

    const { email, password } = loguser;

    const data = { email, password };

    await axios
      .post("/login", data, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        alert("Logged in Successfully!");
        console.log(response);
        setAuthToken(response.data);
        if (remember) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_info", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("user_info", JSON.stringify(response.data.user));
        }
        history.push("/");
      })
      .catch((e) => {
        alert("Log in failed");
        console.log(e);
      });
  };

  

  // Unsplash URL - "https://source.unsplash.com/1600x900/?abstract,illustration"

  const classes = useStyles();

  return (
    <>
    
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={bg1}
      />
      <Container className={classes.login} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <button className="gbtn" onClick={signInWithGoogle}>
            <FcGoogle />
            Sign In with Google{" "}
          </button>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate method="POST">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
              autoFocus
              onChange={inputsHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
              onChange={inputsHandler}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  onClick={() => setRemember(!remember)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signIn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
