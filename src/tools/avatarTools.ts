import axios from 'axios'
import { Session } from 'koishi';

async function urlToBuffer(url: string): Promise<Buffer> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer' // 指定响应类型为二进制数据
    });
    return Buffer.from(response.data, 'binary');
}


async function getSelfAvatar(session:Session):Promise<Buffer> {
    const url = session.event.user?.avatar
    const buf = await urlToBuffer(url)
    return buf
}


async function qcodeGetAvatar(qq:string) {
	const url = `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=640`
	return await urlToBuffer(url)
}

const avatarTools = {urlToBuffer, getSelfAvatar,qcodeGetAvatar}

export default avatarTools