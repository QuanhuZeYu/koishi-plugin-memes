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
        
        // 收集两个参数以及一个self头像
        const self = await tools.avatarTools.getSelfAvatar(s)
        let arg1, arg2
        let _h
        arg1 = await tools.matcher.getArg(args,0)
        arg2 = await tools.matcher.getArg(args,1)
        if(arg1 && arg2) {
            const hug = await MemeGenerator.hug(arg1, arg2)
            _h = await tools.convert2SendMessage.gif2Message(hug)
        } else if(arg1 || arg2) {
            const input = arg1||arg2
            const hug = await MemeGenerator.hug(self, input)
            _h = await tools.convert2SendMessage.gif2Message(hug)
        }
        if(_h)
            s.send(_h)
        else
            s.send('参数过少')
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