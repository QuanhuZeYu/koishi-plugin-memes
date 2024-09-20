import { Argv } from "koishi";
import { ArgMatcher } from "../interface/matcher";
import tools from "./_index";
import Data from "../Data";

function xmlMatcher(match: string, message: string) {
    const result = [];
    // 使用动态的匹配字符串，构造正则表达式，带有全局标志 'g' 来匹配所有出现的结果
    const regex = new RegExp(`${match}="(.*?)"`, 'g'); // `match` 作为匹配内容

    let matchResult;
    while ((matchResult = regex.exec(message)) !== null) {
        // 捕获组的内容
        result.push(matchResult[1]); // matchResult[1] 是捕获的内容
    }

    return result.length > 0 ? result : undefined; // 如果有结果则返回数组，否则返回 undefined
}

// 正则匹配id和src的值
function argCollector(message: string): Array<ArgMatcher> {
    if (!message) return []; // 防御性编程：检查message是否为空

    // 匹配 id 和 src 及其对应的值
    const regex = /(id|src)=["']?([^"']+)["']?/g;
    let matches: RegExpExecArray | null;
    const result: Array<{ [key: string]: string }> = [];

    // 捕获所有的 id 和 src
    while ((matches = regex.exec(message)) !== null) {
        result.push({ [matches[1]]: matches[2] });
    }

    return result;
}

/**
 * 查找消息中的图片参数（仅保留 src 参数，排除 id 参数）
 * @param message 输入的消息字符串
 * @returns 匹配的图片参数数组
 */
function imgCollector(message: string): Array<ArgMatcher> {
    if (!message) return []; // 防御性编程：检查 message 是否为空
    // 使用 argCollector 获取所有参数
    const allArgs = argCollector(message);
    // 过滤掉所有 id 参数，仅保留 src 参数
    const imgArgs = allArgs.filter(arg => 'src' in arg);
    return imgArgs;
}

async function getCollecterArgs(args: Array<ArgMatcher>, index: number): Promise<Buffer | void> {
    if (!args || !args[index]) return; // 防御性编程：检查args是否有效
    return await identifyArg(args[index]);
}

/**
 * 识别捕获到的参数是图片还是头像URL
 * @param arg ArgMatcher类型参数
 * @returns
 */
async function identifyArg(arg: ArgMatcher): Promise<Buffer | void> {
    let r_arg: Buffer | void;

    if (arg?.id) {
        try {
            // 处理 ID 参数，尝试获取头像
            r_arg = await tools.avatarTools.qcodeGetAvatar(arg.id);
        } catch (error) {
            // 捕获 ID 处理中的错误
            Data.baseData.getLogger().error(`无法获取ID为${arg.id}的头像：`, error);
        }
    } else if (arg?.src) {
        try {
            // 处理 SRC 参数，尝试获取图片
            r_arg = await tools.avatarTools.urlToBuffer(arg.src);
        } catch (error) {
            // 捕获 SRC 处理中的错误
            Data.baseData.getLogger().error(`无法获取图片URL为${arg.src}的图片：`, error);
        }
    }

    return r_arg;
}

async function getQuoteArgs(argV: Argv): Promise<Buffer[]> {
    const quoteContent = argV?.session?.quote?.content || ''; // 防御性编程：默认值为空字符串
    const collectArgs = imgCollector(quoteContent);

    const args = await Promise.all(
        collectArgs.map(async (arg) => {
            return await identifyArg(arg);
        })
    );
    return args.filter(Boolean) as Buffer[]; // 过滤掉 undefined 的值
}

/**
 * 提取命令参数中的图片参数，返回图片Buffer的数组
 * @param message 
 * @returns Buffer[]
 */
async function getMessageArgs(message: string): Promise<Buffer[]> {
    const matchArgs: ArgMatcher[] = argCollector(message || ''); // 防御性编程：默认值为空字符串

    const args = await Promise.all(
        matchArgs.map(async (arg) => {
            return await identifyArg(arg);
        })
    );
    return args.filter(Boolean) as Buffer[]; // 过滤掉 undefined 的值
}

async function getAllArgs(argv: Argv, message: string): Promise<Buffer[]> {
    const args = []
    const quoteArgs: Buffer | undefined = await getQuoteArgs(argv)[0];  // 只取一个参数
    let shiftCount = 0
    if (quoteArgs) { shiftCount = quoteArgs.length }
    const messageArgs = await getMessageArgs(message);
    for (let i = 0; i < shiftCount; i++) {
        messageArgs.shift()
    }  // 移除引用消息中的参数
    args.push(quoteArgs ? quoteArgs : undefined, ...messageArgs)
    const filteredArgs = args.filter(arg => arg instanceof Buffer && arg !== undefined);
    // Data.baseData.getLogger().info(filteredArgs)
    return filteredArgs;
}

const matcher = {
    xmlMatcher, argCollector, getCollecterArgs,
    getQuoteArgs, getMessageArgs, getAllArgs
}

export default matcher