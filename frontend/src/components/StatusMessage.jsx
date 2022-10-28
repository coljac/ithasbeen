export default function StatusMessage(props) {
  if(props.message===null) {
    return <></>
  }
    return (
    <div className="status">
       <p>{props.message}</p>
    </div>
  )
}