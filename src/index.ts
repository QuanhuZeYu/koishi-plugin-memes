import { Context, Logger } from 'koishi'
import { Schema } from 'koishi'
import commands from './commands/_index'
import tools from './tools/_index'
import { } from "@quanhuzeyu/koishi-plugin-memelib"
import Data from './Data'

export const name = '@quanhuzeyu/memes'
export const inject = {
	required: ['memelib']
}
export const QHZY_MEME_BASEDIR = __dirname

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
	Data.baseData.setLogger(ctx.logger)
	Data.baseData.setMemelib(ctx.memelib)

	const memes = ctx.command('q-memes', "表情包制作器").usage("输入指令+空格+图片/@某人/文字；实现表情包制作")

	memes.subcommand('petpet [message:text]', "制作摸摸头").alias("摸")
		.action((argv, message) => {
			commands.petpet(argv, message)
		})

	memes.subcommand('hug [message:text]', "制作抱抱").alias("抱")
		.action((argv, message) => {
			commands.hug(argv, message)
		})

	memes.subcommand('hammer [message:text]', "制作锤某人").alias("锤")
		.action((argv, message) => {
			commands.hammer(argv, message)
		})

	memes.subcommand('distracted [message:text]', "制作注意力涣散").alias("注意力涣散")
		.action((argv, message) => {
			commands.distracted(argv, message)
		})

	memes.subcommand('suck [message:text]', "制作咖波吸").alias("咖波吸")
		.action((argv, message) => {
			commands.suck(argv, message)
		})

	memes.subcommand('clown [message:text]', "制作小丑").alias("小丑")
		.action((argv, message) => {
			commands.clown(argv, message)
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
