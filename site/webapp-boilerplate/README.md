## Quick start

* On development, use `grunt dev` to perform tasks such as linting and unit testing, and start the app with Supervisor to monitor changes.

        $ grunt dev
        $ NODE_ENV=development node app/main.js

* On production, use `grunt prod` to create a production build. You can create a startup-script or init-script within your `/etc/init.d` folder, and it can be used to start, stop and respawn processes in the case of an exception crash.

        $ grunt prod
        $ BUILD=`pwd`/build/webapp-boilerplate
        $ cd $BUILD/; npm install --production
        $ NODE_ENV=production node app/main.js
