import { Argv } from "koishi";
import { ArgMatcher } from "../interface/matcher";
import tools from "./_index";

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
    try {
        if (arg?.id) {
            r_arg = await tools.avatarTools.qcodeGetAvatar(arg.id);
        } else if (arg?.src) {
            r_arg = await tools.avatarTools.urlToBuffer(arg.src);
        }
    } catch (error) {
        console.error('识别参数时发生错误：', error);
    }
    return r_arg;
}

async function getQuoteArgs(argV: Argv): Promise<Buffer[]> {
    const quoteContent = argV?.session?.quote?.content || ''; // 防御性编程：默认值为空字符串
    const collectArgs = argCollector(quoteContent);

    const args = await Promise.all(
        collectArgs.map(async (arg) => {
            return await identifyArg(arg);
        })
    );
    return args.filter(Boolean) as Buffer[]; // 过滤掉 undefined 的值
}

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
    const quoteArgs = await getQuoteArgs(argv);
    const messageArgs = await getMessageArgs(message);
    const args = quoteArgs.concat(messageArgs);
    return args;
}

const matcher = {
    xmlMatcher, argCollector, getCollecterArgs,
    getQuoteArgs, getMessageArgs, getAllArgs
}

export default matcher