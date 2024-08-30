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
    // 根据头像url生成摸头图
    const pet = await urlToPet(userAvatarUrl)
    // 判断生成的结果是否为对象
    if (typeof pet === 'object') {
        s.send(pet)
    } else {
        s.send(pet+"；生成图像时发生错误")
    }
}

/**
 * 将给定URL的图片转换为pet
 * 
 * 该函数通过URL获取图片，将其裁剪为圆形，并生成pet如果处理成功，则返回头像图片；
 * 否则返回错误信息如果过程中出现任何错误，则抛出异常
 * 
 * @param url 图片的URL地址
 * @returns 返回一个Promise，解析为头像图片的Buffer或错误信息字符串
 */
async function urlToPet(url:string):Promise<h|string> {
    // 通过URL获取图片并将其转换为Buffer
    const buf = await urlToBuffer(url)
    const _b = MemeGenerator.tools.imageTools.isGif(buf)
    if (_b === false) {
        try {
            // 将Buffer中的图片裁剪为圆形
            const cir = await MemeGenerator.tools.imageTools.cropToCircle(buf)
            // 使用处理后的圆形图片生pet
            const pet = await MemeGenerator.Petpet(cir)
            // 检查生成的宠物头像是否为Buffer类型
            if ( pet instanceof Buffer) {
                return h.image(pet, 'image/gif')
            } else {
                return "制作头像时出现错误"
            }
        } catch (err) {
            // 捕获并打印异常
            console.log(err)
            // 将异常抛出，以便外部处理
            throw err
        }
    } else if (_b === true) {
        const pet = await MemeGenerator.Petpet(buf,true)
        if (pet instanceof Buffer) {
            return h.image(pet, 'image/gif')
        } else {
            return "制作头像时出现错误"
        }
    }
}


export default petpet