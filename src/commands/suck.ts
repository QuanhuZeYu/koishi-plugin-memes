import { Argv, h } from "koishi";
import Data from "../Data";
import tools from "../tools/_index";

async function suck(av:Argv,ms:string) {
    const MemeGenerator = Data.baseData.getMemelib()
    const s = av.session
    const args = tools.matcher.argCollector(ms)
    let arg1:any = args[0]
    if(arg1?.id){arg1 = await tools.avatarTools.qcodeGetAvatar(arg1.id)}
    else if(arg1?.src){arg1 = await tools.avatarTools.urlToBuffer(arg1.src)}
    else {arg1 = undefined}
    if(arg1){
        const suck = await MemeGenerator.memelib.suck(arg1)
        await s.send(h.image(suck, 'image/gif'))
    } else {
        const self = await tools.avatarTools.getSelfAvatar(av.session)
        const suck = await MemeGenerator.memelib.suck(self)
        await s.send(h.image(suck, 'image/gif'))
    }
}

export default suck