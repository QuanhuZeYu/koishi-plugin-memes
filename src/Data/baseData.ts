import { Context } from "koishi";
import type { MemeLib } from "@quanhuzeyu/koishi-plugin-memelib"
import type * as cjl from '@cordisjs/logger'

let memelib: MemeLib
let logger: cjl.LoggerService



const baseData = {
    memelib,
    logger
}

export default baseData