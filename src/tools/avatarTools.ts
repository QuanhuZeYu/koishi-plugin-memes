import { HTTP, Session } from 'koishi';
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';

function urlToBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            // 解析 URL 确定使用 http 或 https
            const parsedUrl = new URL(url);
            const get = parsedUrl.protocol === 'https:' ? httpsGet : httpGet;

            // 发起 GET 请求
            get(url, (response) => {
                const chunks: Uint8Array[] = [];

                // 检查响应状态码
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to fetch the URL: ${url}, Status Code: ${response.statusCode}`));
                    return;
                }

                // 监听数据流
                response.on('data', (chunk) => chunks.push(chunk));
                
                // 监听结束事件
                response.on('end', () => {
                    // 将所有数据块合并为一个 Buffer 并解析
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer);
                });

            }).on('error', (error) => {
                // 处理请求错误
                reject(new Error(`Error fetching the URL: ${url}, Error: ${error.message}`));
            });

        } catch (error) {
            // 捕获和处理同步异常
            reject(new Error(`Invalid URL: ${url}, Error: ${error.message}`));
        }
    });
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