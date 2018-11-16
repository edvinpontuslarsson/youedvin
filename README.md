# Youedvin

This is the repo for the source code of my video sharing web application built with Node.js with the express framework. 

## Running application

You need to have FFmpeg installed to run this application.

### Environment variables

To run this application, you need a .env-file with these variables:

PORT=`<port to run application on>`<br/>
CookieName=`<cookie name of your choice>`<br/>
CookieSecret=`<secret cookie code>`<br/>
dbURL=`<path to a Mongo Database>`<br/>
pageLimit=`<Limit of video links to display per index page, e.g. 20>`<br/>
Environment=`<optional: production>`<br/>

### npm commands

```
# install application and dependencies
npm install

# run automated tests
npm test

# run application
npm start

# run application with nodemon
npm run nodemon
```