<div align="center">
<h1>Telegram bot for Reolink cams</h1>
</div>


<div align="center">

<a href="#">![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)</a>
<a href="#">![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)</a>

</div>


## ❓ Why

This repo introduce a Telegram bot to provides a convenient and reliable solution for obtaining instant images from your Reolink cameras, even when the Reolink app isn't working with the Iliad operator.

Say goodbye to connectivity issues and enjoy seamless access to your camera feeds with this easy-to-use bot!

## 🔨 Build & Run

Before you build the project you need to:
- create a telegram bot and obtain the Telegram bot token
- configure the `.env` and configuration files. You  can find the files inside the `./config/` folder (_you should remove the 'sample' from the filename_)
    - `.env`: contains the Telegram bot token
    - `user-whitelist.json`: contains the Telegram user id allowed to use the telegram bot
    - `reolink.json`: contains the data about the Reolink cams

you can run it all through Docker:

> `docker-compose up -d`

otherwise you can run the project locally with `yarn`. For development you can use :

> `yarn dev`

## 📚 Contribution
Contributions are welcome from the community, big or small! Whether you've found a bug, have a suggestion for a new feature, or just want to lend a hand with some code, we'd be thrilled to have your input. Feel free to take a look at our code and see how you can contribute. I appreciate your support!
