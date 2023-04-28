import { Context, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Update } from 'typegram';
import * as whitelist from './../config/user-whitelist.json';
import * as reolink from './../config/reolink.json';
import * as emoji from 'node-emoji';

export class TgBot {
    private getKeyboard = () => {
        const items: string[][] = [];
        reolink.cams.forEach((it) => items.push([`[${it.id}] ${it.name}`]));
        return Markup.keyboard(items);
    };

    init = () => {
        const bot: Telegraf<Context<Update>> = new Telegraf(
            process.env.BOT_TOKEN as string
        );

        bot.start((ctx) => {
            if (!this.userHasAccess(ctx.message.chat.id)) {
                ctx.replyWithMarkdownV2(
                    `${emoji.get(
                        'no_entry'
                    )} Non hai l'accesso a questo bot, Contatta l'amministratore`
                );
                return;
            }

            ctx.replyWithMarkdownV2(
                'Quale cam vuoi vedere ' + ctx.from.first_name + '?',
                this.getKeyboard()
            );
        });

        bot.on(message('text'), (ctx) => {
            if (!this.userHasAccess(ctx.message.chat.id)) {
                ctx.replyWithMarkdownV2(
                    `${emoji.get(
                        'no_entry'
                    )} Non hai l'accesso a questo bot, Contatta l'amministratore`
                );
                return;
            }

            try {
                const btnid = ctx.message.text.split('[')[1].split(']')[0];
                const cam = reolink.cams.find((it) => it.id === +btnid);
                if (cam) {
                    ctx.replyWithMarkdownV2(
                        `${emoji.get('rocket')} foto in arrivo \\!`,
                        this.getKeyboard()
                    );
                    ctx.replyWithPhoto({
                        url: `http://${cam.ip}/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=x&user=${cam.user}&password=${cam.password}`
                    });
                } else {
                    ctx.replyWithMarkdownV2(
                        'Cam non trovata',
                        this.getKeyboard()
                    );
                }
            } catch (ex) {
                ctx.replyWithMarkdownV2(
                    'Comando non trovato',
                    this.getKeyboard()
                );
            }
        });

        bot.launch();

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    };

    private userHasAccess = (userId: number): boolean =>
        whitelist.usersId.some((it) => it === userId);
}
