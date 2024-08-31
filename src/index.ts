import { Context } from 'koishi'
import {Schema} from 'koishi'
import commands from './commands'

export const name = '模因'
export const QHZY_MEME_BASEDIR = __dirname

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  
  ctx.command('petpet [arg]')
    .alias('摸')
    .action( (_, mes) => {
      // console.log(`mes: ${mes}\nargv:${_}`)
      commands.petpet(_, mes)
      // console.log(argv)
      // console.log(argv.session.event.user)
    })
}
