import Daycount from "./Daycount"
import Happening from "./Happening"

export default function Display(props) {
    if(props.editing) {return <></>}
    return (
      <div className="display">
        <h2>It has been</h2>
        <Daycount count={props.days} />
        <h2>days since</h2>
        <Happening text={props.happening} />
      </div>
      )
}