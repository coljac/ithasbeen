export default function Happening(props) {
    if (props.editable) return (
        <div id="happening">
            <input type="text"  />
        </div>
    )
    return (
        <div id="happening">{props.text}</div>
    )
}