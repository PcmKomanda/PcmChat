# About this project
In high school, we had a yearly project and this project is exactly that. I did this in 2023. It's a chat app, something like Discord, but with fewer features. The only language available is Lithuanian. I had no reason to add another language when I developed this app.


## Features

- Login with third party services(Discord, Google, GitHub)
- Create guilds like in Discord, and add text channels.
- Generate an invite code, which you send to other users.
- Join guilds with an invite code.
- Send, edit or delete messages.
- See who is online.
- Delete guilds.

## Run Locally

**Clone the project**

```bash
  git clone https://github.com/PcmKomanda/PcmChat
```

**Go to the project directory**

```bash
  cd PcmChat
```

**Install dependencies in client folder**

```bash
  cd client
  yarn
```

**Copy .env.sample**

```bash
cp .env.sample .env
```

**Build client**

```bash
yarn build
```

**Go to server and install dependencies**

```bash
cd ../server
yarn
```

**Copy .env.sample and fill it with your information.**\
*Cloudinary is optional, but you won't be able to add images*
```bash
cp .env.sample .env
nano .env
```

**Launch server**
```bash
yarn start
```
## Demo

The demo is no longer available. It's already been a year and my GitHub student perks no longer cover it. 


## Authors

- [@PcmKomanda](https://www.github.com/pcmkomanda)


## Screenshots

You can find screenshots from the website [here](https://github.com/PcmKomanda/PcmChat/tree/master/screenshots)
