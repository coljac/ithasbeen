import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'
import StatusMessage from './components/StatusMessage'
import Header from './components/Header'
import Copy from './components/Copy'
import { createBrowserHistory } from "history"
import Display from './components/Display'
import NewForm from './components/NewForm'

export async function copyTextToClipboard(id) {
  const text = window.location.host + "/" + id;
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

function App() {
  const api_loc = "https://ithasbeen-api-q6klbgmfpa-uc.a.run.app"
  const history = createBrowserHistory();
  const [days, setDays] = useState(0);
  const [happening, setHappening] = useState("");
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [boardID, setBoardID] = useState("new");
  const [editkey, setEditkey] = useState("");
  const [auto, setAuto] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copied, setCopied] = useState(0);

  const getData = function() {
    const pathname = window.location.pathname;
    if ((pathname.length < 2) || (pathname === "/new")) {
      setVisible(true);
      setEditable(true);
      return;
    }
    axios.get(api_loc + "/board" + pathname)
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
    const textv = e.target.elements[1].value;
    const autov = e.target.elements[2].checked;
    if(textv.length > 0) {
      // save
      setDays(daysv);
      setHappening(textv);
      setEditable(false);
      setAuto(autov);
      const url = api_loc + "/board/" + boardID;
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
          setStatusMessage(<>Saved the board.<br/>
        Share the board with <a href={data.board.id}>this link.</a><Copy id={data.board.id} /><br/>
        Edit the board with <a href={data.board.editkey}>this link.</a> <Copy id={data.board.editkey} /><br/>
      </>)
        history.push(data.board.editkey);
        }
      })
    .catch(error => {console.error(error); setVisible(true);})
    }
  }

  return (
    <div className="App" style={{visibility: visible?"visible":"hidden"}}>
      <Header />
      <div className="content">
        <StatusMessage message={statusMessage} />
        <NewForm editing={editable} days={days} happening={happening} statusMessage={statusMessage} 
        auto={auto} doSubmit={doSubmit} />
        <Display editing={editable} days={days} happening={happening} statusMessage={statusMessage} />
      </div>
    </div>
  )

}

export default App
