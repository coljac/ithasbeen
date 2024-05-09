import NewButton from "./Newbutton"
import { useSearchParams } from 'react-router-dom';


export default function Header(props) {
    let [searchParams] = useSearchParams()
    const hide = searchParams.get('hide');
    if(hide) {
        return null
    }
    return (
        <div id="header">
            <NewButton /> 
            <span> <a href="https://github.com/coljac/ithasbeen">About</a></span>
        </div>
    )
}
