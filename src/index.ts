import { Context, h, Schema } from 'koishi'
import {MemeGenerator} from '@quanhuzeyu/koishi-plugin-memelib'
import { tools } from './tools'
import commands from './commands'

export const name = 'example'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  // ctx.on('message', (session) => {
  //   if (session.content === '114514') {
  //     session.send('1919810')
  //   }
  // })
  // ctx.on(`message`,async (session) => {
  //   if(session.content === 'petpet') {
  //     try{
  //       const ava = session.event.user.avatar
  //       const avaBuf = await tools.urlToBuffer(ava)
  //       const petpet = await MemeGenerator.Petpet(avaBuf)
  //       if (petpet instanceof Buffer) {
  //         const img = h.image(petpet, 'image/png')
  //         session.send(img)
  //       } else {
  //         session.send(`生成图像时发生错误`)
  //       }
  //     } catch (err) {
  //       session.send(err)
  //     }
  //   }
  // })
  ctx.command('petpet')
    .alias('摸')
    .option('', '<arg:user>')
    .action(async (argv, mes) => {
      commands.petpet(argv, mes)
      // console.log(argv)
      // console.log(argv.session.event.user)
    })
}
