import { Context, Logger } from 'koishi'
import {Schema} from 'koishi'
import commands from './commands'

export const name = '@quanhuzeyu/memes'
export const QHZY_MEME_BASEDIR = __dirname
export const logger = myLogger()

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('petpet [message:text]')
  .usage('petpet+空格+参数(1个)<@对象|图片|GIF>')
    .action( (_, mes) => {
      // console.log(`mes: ${mes}\nargv:${_}`)
      commands.petpet(_, mes)
      // console.log(argv)
      // console.log(argv.session.event.user)
    })
    ctx.command('hug')
      .usage('hug+空格+参数(最少1个最多两个)<@对象|图片>(参数之间可不需要空格，指令和参数之间空格不可少)')
      .action( (_, mes) => {
        commands.hug(_, mes)
      })
}

function myLogger() {
  const logger = new Logger('@quanhuzeyu/memes')
  return logger
}
