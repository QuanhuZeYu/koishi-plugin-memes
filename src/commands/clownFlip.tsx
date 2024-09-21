import { Argv } from "koishi";
import Data from "../Data";


async function clownFlip(argv: Argv, message: string) {
    const { baseData, tools } = Data
    const { memelib, logger } = baseData
    const meme = memelib.memelib

    const messageImageArgs = await tools.matcher.getMessageArgs(message)
    if (messageImageArgs.length < 1) {
        const self = await tools.avatarTools.getSelfAvatar(argv.session)
        const result = await meme.clownFlip(self)
        let img = <img src={"data:image/png;base64," + result.toString('base64')} />;
        if (memelib.memelib.tools.imageTools.isGif(result)) {
            img = <img src={"data:image/gif;base64," + result.toString('base64')} />;
        }
        const messageStruct = <message>
            {img}
        </message>;
        return await argv.session.send(messageStruct)
    } else {
        const input = messageImageArgs[0]
        const result = await meme.clownFlip(input)
        let img = <img src={"data:image/png;base64," + result.toString('base64')} />;
        if (memelib.memelib.tools.imageTools.isGif(result)) {
            img = <img src={"data:image/gif;base64," + result.toString('base64')} />;
        }
        const messageStruct = <message>
            {img}
        </message>;
        return await argv.session.send(messageStruct)
    }
}

export default clownFlip