import { Argv, h } from "koishi";
import urlToBuffer from "../tools/getAvaImage";
import { MemeGenerator } from "@quanhuzeyu/koishi-plugin-memelib";

/**
 * 当使用 petpet 指令触发的函数
 * @param session 
 * @param message 
 */
async function petpet(session:Argv, message:string) {
    const s = session.session
    // console.log(`arg:\n${arg1}`)
    if (typeof message === 'string') {
        const id = message.match(/id="(.*)"/)
        const img = message.match(/src="(.*)"/)
        // 参数如果是at的逻辑
        if (id != undefined) {
            const atUserAvaUrl = `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${id[1]}&spec=640`
            const pet = await urlToPet(atUserAvaUrl)
            if (typeof pet === 'object') {
                s.send(pet)
            } else {
                s.send(pet+"；无法获取at对象的头像")
            }
        } else 
        // 参数如果是图片的逻辑
        if (img != undefined) {
            const pet = await urlToPet(img[1])
            if (typeof pet === 'object') {
                s.send(pet)
            } else {
                s.send(pet+`；图片参数制作时出现问题    ${typeof pet}`)
            }
        }
        // session.session.send(atUserAvaUrl)  // 调试检查合成的url
        
    }else if (typeof message ==='number') {
        defaultPetpet(session)
    } else {
        // 默认方法： 使用发送指令的人的头像作为摸摸头对象
        defaultPetpet(session)
    }
}

/**
 * 使用发送指令的人的头像作为摸摸头对象
 * @param argV 
 * @param message 
 */
async function defaultPetpet(argV:Argv, message:string=undefined):Promise<void> {
    const s = argV.session
    // 获得一个头像url
    const userAvatarUrl = s.event.user.avatar
    const pet = await urlToPet(userAvatarUrl)
    if (pet instanceof h) {
        s.send(pet)
    } else {
        s.send(pet+"；生成图像时发生错误")
    }
}

async function urlToPet(url:string):Promise<h|string> {
    try {
        const buf = await urlToBuffer(url)
        const cir = await MemeGenerator.tools.imageTools.cropToCircle(buf)
        const pet = await MemeGenerator.Petpet(cir)
        if ( pet instanceof Buffer) {
            return h.image(pet, 'image/gif')
        } else {
            return "制作头像时出现错误"
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}


export default petpet