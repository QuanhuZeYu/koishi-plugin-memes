import Ffmpeg from 'fluent-ffmpeg';

import { Argv, h, Logger } from "koishi";
import tools from "../tools";
import { logger, QHZY_MEME_BASEDIR } from "..";
import fs from 'fs/promises'
import path from "path";
import { MemeGenerator } from "@quanhuzeyu/memelib";
import { read } from 'fs';
import { Readable } from 'node:stream';

async function hug(argv: Argv, message: string) {
    const baseDir = QHZY_MEME_BASEDIR;
    const s = argv.session;
    // region 参数验证
    if (typeof message === 'string') {

        const id = tools.matcher.xmlMatcher('id', message);
        const imgs = tools.matcher.xmlMatcher('src', message);

        let isGif = false;

        if (imgs && imgs instanceof Array && imgs.length > 0) {
            for (const item of imgs) {
                const buffer = await tools.avatarTools.urlToBuffer(item);

                if (MemeGenerator.tools.imageTools.isGif(buffer)) {
                    isGif = true;
                    return s.send("不支持GIF参数");
                }
            }
        }
    // endregion
        if (!isGif) {
            const imgCount = imgs?.length || 0;

            if (imgCount < 1 && id.length < 1) {
                s.send("[memes hug] 请至少发送一张图片作为参数");
            } else if (imgCount < 1 && id.length >= 1) {
                const selfAva = await tools.avatarTools.getSelfAvatar(s);
                const userAva = await tools.avatarTools.qcodeGetAvatar(id[0]);
                // 生成
                const hug = await MemeGenerator.hug(selfAva, userAva);
                MemeGenerator.tools.gifTools.saveGifToFile(hug, path.resolve(QHZY_MEME_BASEDIR, 'out/hug.gif'))
                const re = h.image(hug, 'image/gif');
                
                return s.send(re);
            } else if (imgCount === 1) {
                const selfAva = await tools.avatarTools.getSelfAvatar(s);

                const hug = await MemeGenerator.hug(selfAva, imgs[0]);
                const re = h.image(hug, 'image/gif');
                return s.send(re);
            } else if (imgCount >= 2) {
                const input1 = await tools.avatarTools.urlToBuffer(imgs[0]);
                const input2 = await tools.avatarTools.urlToBuffer(imgs[1]);

                const hug = await MemeGenerator.hug(input1, input2);
                return s.send(h.image(hug, 'image/gif'));
            }
        } else {
            s.send("[memes hug] 抱歉，暂不支持GIF格式的图片");
        }
    }
}

export default hug


// region 私有函数区
async function compressGif(inputBuffer: Buffer): Promise<Buffer> {
    const inStream = bufferToStream(inputBuffer);
    return new Promise((resolve, reject) => {
        const output: Buffer[] = [];

        const ffmpegProcess = Ffmpeg(inStream)
            .outputOptions('-f gif')
            .on('end', () => {
                // 转换完成，将所有数据片段组合成一个 Buffer
                resolve(Buffer.concat(output));
            })
            .on('error', (err) => {
                reject(err);
            })
            .pipe();

        ffmpegProcess.on('data', (chunk) => {
            output.push(chunk);
        });

        ffmpegProcess.on('error', (err) => {
            reject(err);
        });
    });
}

function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}