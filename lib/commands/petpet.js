import { h } from "koishi";
import urlToBuffer from "../tools/getAvaImage";
import { MemeGenerator } from "@quanhuzeyu/koishi-plugin-memelib";
/**
 * 当使用 petpet 指令触发的函数
 * @param session
 * @param message
 */
async function petpet(session, message) {
    const arg1 = session.args[0];
    // console.log(`arg:\n${arg1}`)
    if (typeof arg1 === 'string') {
        const id = arg1.match(/id="([^"]*)"/);
        const atUserAvaUrl = `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${id[1]}&spec=640`;
        // session.session.send(atUserAvaUrl)  // 调试检查合成的url
        try {
            const buf = await urlToBuffer(atUserAvaUrl);
            const cir = await MemeGenerator.tools.imageTools.cropToCircle(buf);
            const pet = await MemeGenerator.Petpet(cir);
            if (pet instanceof Buffer) {
                session.session.send(h.image(pet, 'image/gif'));
                return;
            }
            else {
                session.session.send("制作头像时出现错误，无法获取@对象的头像");
                return;
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    else {
        // console.log(typeof arg1)
    }
    // 获得一个头像url
    const userAvatarUrl = session.session.event.user.avatar;
    const userAvatarBuf = urlToBuffer(userAvatarUrl);
    // 裁切圆形
    const cirAva = MemeGenerator.tools.imageTools.cropToCircle(await userAvatarBuf);
    // 摸摸头制作
    const petpetImg = MemeGenerator.Petpet(await cirAva).then((buf) => {
        if (buf instanceof Buffer) {
            session.session.send(h.image(buf, 'image/gif'));
        }
        else {
            session.session.send("图像生成失败");
        }
    });
}
export default petpet;
