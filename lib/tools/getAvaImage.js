import axios from 'axios';
async function urlToBuffer(url) {
    const response = await axios.get(url, {
        responseType: 'arraybuffer' // 指定响应类型为二进制数据
    });
    return Buffer.from(response.data, 'binary');
}
export default urlToBuffer;
