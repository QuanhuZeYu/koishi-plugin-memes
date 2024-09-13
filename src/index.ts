import { Context, Logger } from 'koishi'
import {Schema} from 'koishi'
import commands from './commands/_index'
import tools from './tools/_index'
import {} from "@quanhuzeyu/koishi-plugin-memelib"
import Data from './Data'

export const name = '@quanhuzeyu/memes'
export const inject = {
	required: ['memelib']
}
export const QHZY_MEME_BASEDIR = __dirname

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
	Data.baseData.setMemelib(ctx.memelib)

  	ctx.command('petpet [message:text]')
		.usage('petpet+空格+参数(1个)<@对象|图片|GIF>')
		.action( (_, mes) => {
			// console.log(`mes: ${mes}\nargv:${_}`)
			commands.petpet(_, mes)
			// console.log(argv)
			// console.log(argv.session.event.user)
    })
	ctx.command('hug [message:text]')
		.usage('hug+空格+参数(最少1个最多两个)<@对象|图片>(参数之间可不需要空格，指令和参数之间空格不可少)')
		.action( (_, mes) => {
			commands.hug(_, mes)
		})
	ctx.command('hammer [message:text]')
		.usage('hammer+空格+参数(最多读取一个，可不提供)<@对象|图片>')
		.action( (_, mes) => {
			commands.hammer(_, mes)
		})
	ctx.command('注意力涣散 [message:text]')
		.usage('注意力涣散+空格+参数(最多读取一个，可不提供)<@对象|图片>')
		.action( (_, mes) => {
			commands.distracted(_, mes)
	})
	ctx.command('咖波吸 [message:text]')
		.usage('咖波吸+空格+参数(最多读取一个，可不提供)<@对象|图片>')
		.action((_, mes) => {
			commands.suck(_, mes)
		})


    // 测试用指令
    // ctx.command('hq-test [message:text]')
    //   .action((_,mes)=> {
    //     logger.info(mes)
    //     const args = tools.matcher.argCollector(mes)
    //     for(const arg of args) {
    //       logger.info(arg)
    //     }
    //   })
}
