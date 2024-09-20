import { Argv } from "koishi";
import Data from "../Data";
import tools from "../tools/_index";


async function clown(argv: Argv, message: string) {
    const { baseData } = Data
    const { getMemelib, getLogger } = baseData

    const imageArgs = await tools.matcher.getMessageArgs(message)
    if (imageArgs.length < 1) {
        const selfAvatar = await tools.avatarTools.getSelfAvatar(argv.session)
        const clown = await getMemelib().memelib.clown(selfAvatar)
        const messageStruct = <message>
            <quote id={argv.session.messageId} />
            <img src={"data:image/png;base64," + clown.toString("base64")} />
        </message>;
        return await argv.session.send(messageStruct)
    } else {
        const input = imageArgs[0]
        const clown = await getMemelib().memelib.clown(input)
        const image = await getMemelib().memelib.tools.imageTools.isGif(clown) ? <img src={"data:image/gif;base64," + clown.toString("base64")} /> : <img src={"data:image/png;base64," + clown.toString("base64")} />
        const isQuote = await getMemelib().memelib.tools.imageTools.isGif(clown) ? <quote id={argv.session.messageId} /> : ""
        const messageStruct = <message>
            {isQuote}
            {image}
        </message>;
        return await argv.session.send(messageStruct)
    }
}

export default clown