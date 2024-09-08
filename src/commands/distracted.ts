import { Argv } from "koishi";
import { getMemelib } from "../context";
import tools from "../tools/_index";

async function distracted(av:Argv,ms:string) {
    const MemeGenerator = getMemelib()
    const s = av.session
    const args = tools.matcher.argCollector(ms)
    let arg1:any = args[0]
    if(arg1?.id){arg1 = await tools.avatarTools.qcodeGetAvatar(arg1.id)}
    else if(arg1?.src){arg1 = await tools.avatarTools.urlToBuffer(arg1.src)}
    else {arg1 = undefined}
    if(arg1){
        const distra = await MemeGenerator.memelib.distracted(arg1)
        const msg = await tools.convert2SendMessage.gif2Message(distra)
        s.send(msg)
    } else {
        const self = await tools.avatarTools.getSelfAvatar(av.session)
        const distra = await MemeGenerator.memelib.distracted(self)
        const msg = await tools.convert2SendMessage.gif2Message(distra)
        s.send(msg)
    }
}

export default distracted