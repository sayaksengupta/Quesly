import React from "react";
import Navbar from "./Navbar";
import Pulse from 'react-reveal/Pulse';

function Contact() {
  return (
    <>
    <Navbar activeStatus="contact" />
    <div style={{display:"flex",justifyContent:"center", alignItems:"center",height:"90vh"}}>
      <span style={{fontSize:"2rem",wordSpacing:"0.25rem",fontWeight:'bold'}}>
        Made with {" "}
        <Pulse forever>
        <i class="fa fa-heart pulse" style={{color:"red"}}></i> 
        </Pulse>
        {" "}By
        Team Quesly
      </span>
    </div>
    </>
  );
}

export default Contact;
