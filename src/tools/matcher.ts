
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

const matcher = {
    xmlMatcher
}

export default matcher