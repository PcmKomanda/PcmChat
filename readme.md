# About this project
In high school we had yearly project and this project is exactly that. I did this in 2023. It's chat app. Something like discord, but with a lot less features. Only language available is Lithuanian. When I developed this app, I didn't had any reason to add any other language.


## Features

- Login with third party services(Discord, Google, GitHub)
- Create guilds like in Discord, add text channels.
- Generate invite code, which you send to other user.
- Join guilds with invite code.
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

**Copy .env.sample and fill it with you information.**\
*Cloudinary is optional, but then you can't add guild icon.*
```bash
cp .env.sample .env
nano .env
```

**Launch server**
```bash
yarn start
```
## Demo

Demo is no longer available. It's been already a year and my GitHub student perks doesn't cover it anymore. 


## Authors

- [@PcmKomanda](https://www.github.com/pcmkomanda)


## Screenshots

You can find screenshots from website [here](https://github.com/pcmkomanda/PcmChat/screenshots)