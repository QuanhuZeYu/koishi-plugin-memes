import { Context } from "koishi";
import type { MemeLib } from "@quanhuzeyu/koishi-plugin-memelib"

let memelib: MemeLib

export function setMemelib(lib: MemeLib) {
  memelib = lib
}

export function getMemelib() {
    if (!memelib) 
        throw new Error("memelib not set")
    return memelib
}