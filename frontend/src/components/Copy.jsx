import { useState } from "react";

async function copyTextToClipboard(id) {
  const text = window.location.hostname + ":" + window.location.port + "/" + id;
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export default function Copy(props) {
    const [text, setText] = useState("copy")
    return (
        <span onClick={(e) => {copyTextToClipboard(props.id); setText("copied!")}}>[{text}]</span>
    )
}