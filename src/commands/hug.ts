import Ffmpeg from 'fluent-ffmpeg';

import { Argv, h } from "koishi";
import tools from "../tools/_index";
import { Readable } from 'node:stream';
import Data from '../Data';


async function hug(argv: Argv, message: string) {
	const session = argv.session;
	const { baseData } = Data
	const { memelib } = baseData
	try {
		// 获取所有参数
		const args = await tools.matcher.getAllArgs(argv, message);
		// 如果没有足够的参数，发送帮助提示
		if (args.length < 1) {
			await session.send('参数过少或识别失败，请使用`指令 -h`的方式查看帮助');
			return;
		}
		// 获取自定义或默认的头像
		const [arg1, arg2] = args;
		const selfAvatar = await tools.avatarTools.getSelfAvatar(session);
		// 生成结果图片
		const result = args.length === 1
			? await memelib.memelib.hug(selfAvatar, arg1)
			: await memelib.memelib.hug(arg1, arg2);
		// 发送生成的图片
		await session.send(h.image(result, 'image/gif'));
	} catch (error) {
		// 错误处理，确保程序健壮性
		console.error('处理 hug 命令时出错:', error);
		await session.send('执行命令时发生了未知错误，请稍后再试。');
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