# DECA Search React App

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

DECA's Decentralized Carbon Credits Search Engine.\
Official Carbon credits database address ([orbitdb](https://github.com/orbitdb/orbit-db))
**/orbitdb/zdpuAykPJ4qtBg2toS2vxr5eaPfGEBJmvGerM7V7x8qn5c8hW/decaCCDB**
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). 

## Table of Contents

[[_TOC_]] 

## General Folder Structure

```sh
├── package.json
├── package-lock.json
├── public
│   ├── DC-1-Blanco.png
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── serviceWorker.js
│   └── setupTests.js
└── yarn.lock
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js >= 10

## Installation

**Download and install Node.js v10.x and npm.**

> Using Ubuntu

```sh
   $ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
   $ sudo apt-get install -y nodejs
```

> Using Debian, as root

```sh
   $ curl -sL https://deb.nodesource.com/setup_10.x | bash - 
   $ apt-get install -y nodejs
```

**Clone the repo, switch to decasearch and run npm install**

```sh
   $ git clone https://gitlab.com/deca-currency/decasearch.git
   $ cd decasearch
   $ npm install
```

It's recommended to fix security vulnerabilities in dependencies using the command

```sh
   $ npm audit fix
```

In the project directory, you can run:

```sh
   $ npm start
```

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

```sh
   $ npm run build
``` 

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Development

* js-ipfs >= 0.41

To be able to use the orbitdb database of the [carboncreditsbacklog](https://gitlab.com/deca-currency/carboncreditsbacklog) repository which is implemented in [go-ipfs](https://github.com/ipfs/go-ipfs) it is necessary to use circuit relay because react uses [js-ipfs](https://github.com/ipfs/js-ipfs) and add this configuration in the initialization of ipfs

```sh
"relay": {
    "enabled": true,
    "hop": {
      "enabled": true
    }
}
```

It is also necessary to enable the sending through WebSocket in the go-ipfs nodes to be able to make the connection and replicate the database. Once the WebSocket is enabled, the connection is made manually before connecting to the database.

## Deploy

### Prerequisites

* Nginx >= 1.14.0
* Certbot >= 1.6
* serve >= 11.3.2
* pm2 >= 4.4.0

Install Nginx 

```sh
   $ sudo apt update
   $ sudo apt install nginx
``` 

Install Certbot

```sh
   $ sudo add-apt-repository ppa:certbot/certbot
```

**clone the repo in /var/www/ and switch to decasearch directory:**

```sh
   $ cd /var/www/
   $ sudo https://gitlab.com/deca-currency/decasearch.git
   $ cd decasearch
```

**install the react dependencies:**

```sh
$ sudo npm install
```

**Build project to deploy**

```sh
$ sudo npm run build
```

```sh
> my-app@0.1.0 build /var/www/decasearch
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  929.36 KB  build/static/js/2.42d485fa.chunk.js
  19.94 KB   build/static/css/2.36020323.chunk.css
  3.18 KB    build/static/js/main.a003ea06.chunk.js
  955 B      build/static/css/main.08bc9497.chunk.css
  772 B      build/static/js/runtime-main.83c3e0c4.js

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy
```

Startup pm2 in systemd 

```sh 
   $ pm2 startup systemd
```

Run the command that was generated to set PM2 up to start on boot

```sh 
   $ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u your-username --hp /home/your-username
```

In the directory run 

```sh 
   $ pm2 ecosystem
```

Edit file with the next configuration

```sh 
apps:[
    {
    name          : 'decasearch',
    script        : 'npx',
    interpreter   : 'none',
    args          : 'serve build -s',
    env_production : {
        NODE_ENV: 'production'
    }
    }
]
```

Start the pm2 process 

```sh 
   $ pm2 start ecosystem.config.js
```

Check status should show **status: online**

```sh 
   $ pm2 show decasearch
```

In the nginx config add the proxy pass

```sh
// If serving from root, use / instead of /your-path
location ^~ /your-path {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_pass http://127.0.0.1:5000;
    proxy_redirect off;
}
```

**Now restart up Nginx!**

**Remember to open the port in the firewall**

### Add SSL Certificate

```sh
   $ sudo certbot --nginx -d search.deca.green 
```

**It is recommended to redirect all http traffic to https**


Finally renew the certificate with the following command and restart nginx

```sh
$ sudo certbot renew --dry-run
$ sudo service nginx restart
```

If you changed up your repository or made any changes to the configuration, just do a pull in the repo and restart nginx:

```sh
   $ git pull
   $ npm install 
   $ npm build
   $ pm2 restart decasearch
   $ sudo service nginx restart
```

# License

[**GPLV3**](./LICENSE).

# Information and contacts.

***Developers***
- Jose [jose@deca.eco](mailto:jose@deca.eco)
- Osmar [osmar@deca.eco](mailto:osmar@deca.eco)
