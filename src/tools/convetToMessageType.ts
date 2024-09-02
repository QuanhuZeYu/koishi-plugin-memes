import { h } from "koishi";

function gif2Message(gif: Buffer) {
    const _ = h.image(gif, 'image/gif')
    return _
}


const convert2SendMessage = {gif2Message}

export default convert2SendMessage