import { Context } from "koishi";
import type { MemeLib } from "@quanhuzeyu/koishi-plugin-memelib"

let memelib: MemeLib

function setMemelib(lib: MemeLib) {
  memelib = lib
}

function getMemelib() {
    if (!memelib) 
        throw new Error("memelib not set")
    return memelib
}



const baseData = {
    setMemelib,getMemelib,
}

export default baseData