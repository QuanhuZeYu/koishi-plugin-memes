import Ffmpeg from 'fluent-ffmpeg';

import { Argv, h, Logger } from "koishi";
import tools from "../tools/_index";
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
        // 从头到尾收集参数
        const args = tools.matcher.argCollector(message);
        // 如果只有一个参数，需要将用户头像作为self传入
        if(args.length < 2) {
            const self = await tools.avatarTools.getSelfAvatar(s)
        } else if(args.length >= 2) {
            const _arg1 = args[0];
            let arg1:Buffer
            if(_arg1?.id) {arg1 = await tools.avatarTools.qcodeGetAvatar(_arg1.id)}
            else{arg1 = await tools.avatarTools.urlToBuffer(_arg1.src)}
            const _arg2 = args[1];
            let arg2:Buffer
            if(_arg2?.id) {arg2 = await tools.avatarTools.qcodeGetAvatar(_arg2.id)}
            else{arg2 = await tools.avatarTools.urlToBuffer(_arg2.src)}
            const hug = await MemeGenerator.hug(arg1, arg2)
            const _h = tools.convert2SendMessage.gif2Message(hug)
            s.send(_h)
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