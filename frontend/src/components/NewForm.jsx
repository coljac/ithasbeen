
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

export default function NewForm(props) {
    if(!props.editing) {return <></>}
    const editable = props.editable;
    const auto = props.auto;
    const days = props.days;
    const happening = props.happening;

    return (
    <form onSubmit={props.doSubmit}>
        <h2>It has been</h2>
        <input type="number" defaultValue={days} size="4" /><br/>
        <div className="checkbox">
          Update automatically: <input type="checkbox" defaultChecked={auto} />
        </div>
        <h2>days since</h2>
        <input type="text" defaultValue={happening} size="40" />
        <br/>
        <br/>
        <button type='submit'>
          Save
        </button>
      </form>
    )
}