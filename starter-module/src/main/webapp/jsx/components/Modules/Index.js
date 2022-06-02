import React from "react";
import { useHistory } from "react-router-dom";
import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const userToken = currentUserSubject && currentUserSubject.value ? currentUserSubject.value.id_token : "";




export default function ExternalModules(props) {

  //let history = useHistory();
  const src = props.location.state;
  //const src = 'http://localhost:3001'
  var myRequest = new Request(src);
  console.log(src)

  if(!src){
    return (
        <>
          <span>Incorrect url</span>
          
        </>
    )
  }
  return (

      <>
      {/* <iframe  style={{width:"100%", height:"100%", border:"none", margin:0, padding:0}} src={src + "?jwt="+encodeURIComponent(userToken)} ></iframe> */}
      <embed src={src+ "?jwt="+encodeURIComponent(userToken)}
      width="1000" 
      height="1000" 
      onerror="alert('URL invalid !!');"
      />
      </>
  );
}
