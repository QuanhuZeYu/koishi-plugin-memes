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
        const messageStruct = <message>
            <img src={'data:image/png;base64,' + result.toString('base64')} />
        </message>;
        return await argv.session.send(messageStruct)
    }
}

export default clownFlip