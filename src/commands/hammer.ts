import { Argv } from "koishi";
import tools from "../tools/_index";
import { MemeGenerator } from "@quanhuzeyu/memelib";

async function hammer(argv:Argv,mes:string) {
    const s = argv.session
    const args = tools.matcher.argCollector(mes)
    let arg1:any = args[0]
    if(arg1?.id){arg1 = await tools.avatarTools.qcodeGetAvatar(arg1.id)}
    else if(arg1?.src){arg1 = await tools.avatarTools.urlToBuffer(arg1.src)}
    else {arg1 = undefined}
    if(arg1){
        const hammer = await MemeGenerator.hammer(arg1)
        const msg = await tools.convert2SendMessage.gif2Message(hammer)
        s.send(msg)
    } else {
        const self = await tools.avatarTools.getSelfAvatar(argv.session)
        const hammer = await MemeGenerator.hammer(self)
        const msg = await tools.convert2SendMessage.gif2Message(hammer)
        s.send(msg)
    }
}


export default hammer