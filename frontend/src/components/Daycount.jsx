export default function Daycount(props) {
    if (props.editable) return (
        <div id="count">
            <input type="number" defaultValue={77} />!
        </div>
    )
    return (
        <div id="count">{new Intl.NumberFormat().format(props.count)}</div>
    )
}