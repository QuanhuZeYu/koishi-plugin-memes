import { Context } from "koishi";
import type { MemeLib } from "@quanhuzeyu/koishi-plugin-memelib"
import type * as cjl from '@cordisjs/logger'

let memelib: MemeLib
let logger:cjl.LoggerService

function setMemelib(lib: MemeLib) {
  memelib = lib
}

function getMemelib() {
    if (!memelib) 
        throw new Error("memelib not set")
    return memelib
}

function setLogger(log:cjl.LoggerService) {
    logger = log
}

function getLogger() {
    if (!logger) 
        throw new Error("logger not set")
    return logger
}



const baseData = {
    setMemelib,getMemelib,
    setLogger,getLogger
}

export default baseData