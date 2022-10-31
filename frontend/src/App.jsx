import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'
import Daycount from './components/Daycount'
import Happening from './components/Happening'
import StatusMessage from './components/StatusMessage'
import { createBrowserHistory } from "history"

export async function copyTextToClipboard(id) {
  const text = window.location.hostname + "/" + id;
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

function App() {
  const history = createBrowserHistory();
  const [days, setDays] = useState(0);
  const [happening, setHappening] = useState("");
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [boardID, setBoardID] = useState("new");
  const [editkey, setEditkey] = useState("");
  const [auto, setAuto] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const getData = function() {
    const pathname = window.location.pathname;
    if ((pathname.length < 2) || (pathname === "/new")) {
      setVisible(true);
      setEditable(true);
      return;
    }
    axios.get("http://localhost:8000/board" + pathname)
    .then(result => {
        const data = result.data;
        // console.log(data);
        if(data.error != null) {
          setDays(0);
          setHappening("you tried to access a non-existent board");
        } else {
          setHappening(data.happening);
          setDays(data.days);
          setBoardID(data.id);
          setEditkey(data.editkey);
          setAuto(data.auto);
          if(data.editkey.length > 0) {
            setEditable(true);
            setStatusMessage(<>Editing board at <a href={data.id}>this link.</a></>);
          }
        }
        setVisible(true);
       document.title = "It has been " + data.days + " days";})
    .catch(error => {console.error(error); setVisible(true);})
  }
  useEffect( getData, [])

  const doSubmit = function(e) {
    e.preventDefault();
    // console.log("Submitted!")
    const daysv = e.target.elements[0].value;
    const autov = e.target.elements[1].checked;
    const textv = e.target.elements[2].value;
    if(textv.length > 0) {
      // save
      setDays(daysv);
      setHappening(textv);
      setEditable(false);
      setAuto(autov);
      const url = "http://localhost:8000/board/"+boardID;
      axios.put(url,
      {
      "id":boardID,
      "days": daysv,
      "happening": textv,
      "editkey": editkey,
      "checkpoint": "",
      "auto": autov
    }
      )
      .then(result => {
        const data = result.data;
        if(data.status != "OK") {
          setDays(0);
          setHappening(data.message);
        } else {
          setStatusMessage(<>Saved the thingy.<br/>
        Share the board with <a href={data.board.id}>this link.</a><span onClick={() => {copyTextToClipboard(data.board.id)}}>[copy]</span><br/>
        Edit the board with <a href={data.board.editkey}>this link.</a><span onClick={() => {copyTextToClipboard(data.board.editkey)}}>[copy]</span><br/>
      </>)
        history.push(data.board.editkey);
        }
      })
    .catch(error => {console.error(error); setVisible(true);})
      // redirect
    }
  }

  if(editable) {
    return (
    <div className="App" style={{visibility: visible?"visible":"hidden"}}>
      <StatusMessage message={statusMessage} />
      <form onSubmit={doSubmit}>
        <h2>It has been</h2>
        <input type="number" defaultValue={days} size="4" /><br/>
        <div className="checbox">
          Update automatically: <input type="checkbox" defaultChecked={auto} />
        </div>
        {/* <Daycount count={count} editable={editable} /> */}
        <h2>days since</h2>
        <input type="text" defaultValue={happening} size="40" />
        <br/>
        <br/>
        {/* <Happening text={happening} editable={editable} /> */}
        <button type='submit'>
          Save
        </button>
      </form>
    </div>
    )
  }
  return (
    <div className="App" style={{visibility: visible?"visible":"hidden"}}>
      <StatusMessage message={statusMessage} />
      <h2>It has been</h2>
       <Daycount count={days} editable={editable} />
      <h2>days since</h2>
      <Happening text={happening} editable={editable} />
    </div>
  )
}

export default App
