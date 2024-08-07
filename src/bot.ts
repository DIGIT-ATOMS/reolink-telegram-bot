/* eslint-disable */
import { Context, Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { Update } from 'typegram';
import * as whitelist from './../config/user-whitelist.json';
import * as reolink from './../config/reolink.json';
import * as emoji from 'node-emoji';
const Recorder = require('node-rtsp-recorder').Recorder
import fs from 'fs';


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
                console.log("cam:", cam)
                if (cam) {
                    if(cam.id >= 100) {
                        fs.unlink('./ezviz/2024/image/2024.jpg', (err) => {
                            if (err) {
                                console.log(err)
                            } //handle your error the way you want to;
                            var rec = new Recorder({
                                url: `rtsp://${cam.user}:${cam.password}@${cam.ip}:554/live`,
                                folder: './',
                                name: 'ezviz',
                                type: 'image',
                                directoryPathFormat: 'YYYY',
                                fileNameFormat: `YYYY`,
                            });

                            rec.captureImage(() => {
                                console.log('Image Captured');

                                // Check if the file exists
                                fs.access('./ezviz/2024/image/2024.jpg', fs.constants.F_OK, (err) => {
                                    if (err) {
                                        // Handle error (e.g., file doesn't exist)
                                        console.error('Error accessing file:', err);
                                    } else {
                                        // File exists, send it
                                        console.log('Sending photo:', './ezviz/2024/image/2024.jpg');
                                        ctx.replyWithPhoto({
                                            source: './ezviz/2024/image/2024.jpg'
                                        });
                                    }
                                });
                            });
                        });
                    } else {
                        ctx.replyWithMarkdownV2(
                            `${emoji.get('rocket')} foto in arrivo \\!`,
                            this.getKeyboard()
                        );
                        ctx.replyWithPhoto({
                            url: `http://${cam.ip}/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=x&user=${cam.user}&password=${cam.password}`
                        });
                    }


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
