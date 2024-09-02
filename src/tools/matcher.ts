import { Matcher } from "../interface/matcher";
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

function argCollector(message: string): Array<Matcher> {
    // 正则表达式用于匹配 id 和 src 以及其对应的值
    const regex = /(id|src)=["']?([^"']+)["']?/g;
    let matches: RegExpExecArray | null;
    const result: Array<{ [key: string]: string }> = [];

    // 使用正则表达式捕获所有的 id 和 src
    while ((matches = regex.exec(message)) !== null) {
        // 将捕获到的 id 和 src 的值放入结果数组中
        result.push({ [matches[1]]: matches[2] });
    }

    return result;
}


async function getArg(args: Array<Matcher>, index:number):Promise<Buffer|void> {
    let arg:Buffer|undefined
    if(args[index]?.id){arg = await tools.avatarTools.qcodeGetAvatar(args[index].id)}
    else if(args[index]?.src){arg = await tools.avatarTools.urlToBuffer(args[index].src)}
    else {arg = undefined}
    return arg
}

const matcher = {
    xmlMatcher,argCollector,getArg
}

export default matcher