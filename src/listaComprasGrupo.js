const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

let dados = {}

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`))
            , {columns: 3}
    )
)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}!`)
    await ctx.reply('Escreva os itens que você deseja adicionar.!.!.!')
})

bot.use((ctx, next) => {
    const chatId = ctx.chat.id
    console.log(ctx.chat)
    if(!dados.hasOwnProperty(chatId)){ // O método hasOwnProperty() retorna um booleano indicando se o objeto possui a propriedade especificada como uma propriedade definida no próprio objeto em questão (ao contrário de uma propriedade herdada).
        dados[chatId] = []
    }
    ctx.itens = dados[chatId]
    next()
})

bot.on('text', ctx => {
    console.log(ctx)
    let texto = ctx.message.text
    //  O método startsWith() determina se uma string começa com os caracteres da string especificada, retornando true ou false
    if(texto.startsWith('/')){
        texto = texto.substring(1)
    }
    ctx.itens.push(texto)
    ctx.reply(`${texto} adicionado!`, botoes(ctx.itens))
})

bot.action(/delete (.+)/, ctx => {
    const indice = ctx.itens.indexOf(ctx.match[1])
    if(indice >= 0 ){
        ctx.itens.splice(indice, 1)  
    }
    ctx.reply(`${ctx.match[1]} deletado`, botoes(ctx.itens))
})

bot.startPolling()
