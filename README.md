![](//raw.github.com/cheton/webapp-boilerplate/master/web/images/logo.png)

## Overview 

The WebApp Boilerplate is a frontend/backend JavaScript stack which is comprised of HTML/JavaScript/CSS tools and frameworks for building web applications. You can initialize and create a new project using the scaffold.

## Installation

1. Clone the git repo to your local computer

        $ git clone https://github.com/cheton/webapp-boilerplate.git

2. Install [NodeJS](http://nodejs.org/) (>= 0.8)

    Click the link to download the Node.js source code or a pre-built installer for your platform.

    http://nodejs.org/download/

3. Install [Node Package Manager](http://nodejs.org/) (>= 1.1)

    Click the link to download install script and follow the installation instructions.

    https://npmjs.org/install.sh

        $ curl http://npmjs.org/install.sh | sh

4. Install [Grunt](http://gruntjs.com/) using NPM

    It will drop modules in {prefix}/lib/node_modules, and puts executables files in {prefix}/bin, where {prefix} is usually something like /usr or /usr/local.

        $ npm install -g grunt

5. Install Node modules using NPM

        $ npm install

## Development

        $ grunt build:dev run:dev

## Production

        $ grunt build:prod run:prod
