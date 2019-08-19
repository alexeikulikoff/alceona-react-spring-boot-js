import React, { useState,   useContext , useEffect, useLayoutEffect, useMemo }  from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const DataContext = React.createContext([[], () => []]);
let stompClient ;

let index = 0;

const DataProvider = (props) => {

    const [state, setState] =  useState(["data 1", "data 2"]);

    return (
      <DataContext.Provider value={[state, setState]}>
        {props.children}
      </DataContext.Provider>
    );
}
const useData = () => {
      const[state, setState] = useContext( DataContext );
      function addData(f){
        setState((s)=> ( [...state, f] ) );
      }
      return {
        state,
        addData
      }

}

const disconnect = ()=>{
  console.log('disconnect...');
}

const BtnStart = () => {

  let i=0;
  let tmp = [];
  const [state, setState] = useState( [] );

  const sendmessage = ()=>{
      stompClient.send("/app/inbound-message", {}, JSON.stringify({'content': 'sobaka1'}));
  }


  const start = () => {

    stompClient = Stomp.over( SockJS('/gs-guide-websocket') );
    stompClient.connect({}, (frame)=> {
      stompClient.subscribe('/topic/outbound-messages', (s) => {

          let f = JSON.parse(s.body).content + " " + i++;

          if (tmp.length > 5){
            tmp.shift();
            tmp.push(f);
          }else{
              tmp.push(f);
          }
          setState((v)=> ([...state, tmp]));

        });
     });
  }

  return (
     <div>
      <button onClick={start}> Start </button>
      <button onClick={sendmessage}> SendMessage </button>
      <div><table border="1">
        { state.length > 0 ?  state[0].map((s,i)=>(<tr key={i}><td>{s}</td></tr>))  : <tr><td></td></tr> }
        </table>
      </div>
      </div>
  )
}
const Btn = ()=>{
  const [state, setState ] = useState([]);

const testData = () =>{

  let u = [];
  u.push("1");
  u.push("2");
  u.push("3");
  u.push("4");
  console.log(u);

  u.shift();
  u.push("5");

  console.log(u);
}


  return (
   <React.Fragment>
     <button  onClick={testData}> Test</button>
    </React.Fragment>

  )
}
const BtnDisconnect = ()=>{
    const disconnect = ()=>{
      stompClient.disconnect(function() {
            alert("See you next time!");
      });
    }
    return (
       <button  onClick={disconnect}> Disconnect</button>
    )
}
const App = ()=> {

  return (

    <div>
      <h3>hello from react to Spring</h3>
      <h2> hello again </h2>
      <div>
      <BtnStart />
       <Btn />
      <BtnDisconnect />
      </div>
    </div>

  );
}

export default App;
