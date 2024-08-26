import { Argv } from "koishi";
/**
 * 当使用 petpet 指令触发的函数
 * @param session
 * @param message
 */
declare function petpet(session: Argv, message: string): Promise<void>;
export default petpet;
