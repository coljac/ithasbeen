import NewButton from "./Newbutton"

export default function Header(props) {
    return (
        <div id="header">
            <NewButton /> 
            <span> <a href="https://github.com/coljac/ithasbeen">About</a></span>
        </div>
    )
}