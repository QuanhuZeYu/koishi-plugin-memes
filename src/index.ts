import { Context, Schema } from 'koishi'
import commands from './commands'

export const name = 'memes'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('petpet [arg]')
    .action( (_, mes) => {
      // console.log(`mes: ${mes}\nargv:${_}`)
      commands.petpet(_, mes)
      // console.log(argv)
      // console.log(argv.session.event.user)
    })
}
