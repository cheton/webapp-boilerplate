![](//raw.github.com/cheton/webapp-boilerplate/master/web/images/logo.png)

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

4. Install [Grunt](http://gruntjs.com/) and [PhantomJS](http://phantomjs.org/) using NPM

    It will drop modules in {prefix}/lib/node_modules, and puts executables files in {prefix}/bin, where {prefix} is usually something like /usr or /usr/local.

        $ npm install -g grunt
        $ npm install -g phantomjs

5. Install Node modules using NPM

        $ npm install

## Features

* [HTML5 Boilerplate](http://html5boilerplate.com/)
  HTML5 Boilerplate helps you build fast, robust, and adaptable web apps or sites. Kick-start your project with the combined knowledge and effort of 100s of developers, all in one little package.
* [Grunt](http://gruntjs.com/)
  Grunt is a task-based command line build tool for JavaScript projects.
* [RequireJS](http://requirejs.org/)
  RequireJS is a JavaScript file and module loader.
* [Express](http://expressjs.com/)
  Express is a minimal and flexible node.js web application framework, providing a robust set of features for building single and multi-page, and hybrid web applications.
* Multiple languages with [i18next](http://i18next.com/)
  18next is a full-featured i18n javascript library for translating your webapplication.
* Logging with [Winston](https://github.com/flatiron/winston)
  A multi-transport async logging library for node.js.
* URL routing with [Director](https://github.com/flatiron/director)
  Director is a router. Routing is the process of determining what code to run when a URL is requested.
* Unit testing framework integration using PhantomJS with QUnit.
* Includes sample apps with jQuery, Underscore, Backbone and Twitter Bootstrap.

## Quick start

Creating a development build with Grunt.

``` bash
    $ grunt build:dev run:dev
```

Creating a production build with Grunt.

``` bash
    $ grunt build:prod run:prod
```
