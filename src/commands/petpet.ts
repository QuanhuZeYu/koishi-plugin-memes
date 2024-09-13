import { Argv, h } from "koishi";
import Data from "../Data";
import tools from "../tools/_index";

/**
 * 当使用 petpet 指令触发的函数
 * @param session 
 * @param message 
 */
async function petpet(av:Argv, ms:string) {
    const MemeGenerator = Data.baseData.getMemelib()
    const s = av.session
    try {
        const args = await tools.matcher.getAllArgs(av, ms)
        const arg1 = args[0]
        const selfAvatar = await tools.avatarTools.getSelfAvatar(s)
        const result = args.length < 1
            ? await MemeGenerator.memelib.craftPetpet(selfAvatar) as Buffer
            : await MemeGenerator.memelib.craftPetpet(arg1) as Buffer
        s.send(h.image(result,'image/gif'))
    } catch (e) {
        console.error('处理 hug 命令时出错:', e)
		await s.send('执行命令时发生了未知错误，请稍后再试。')
    }
}

export default petpet