# lamisplus-core-enhancement application
# Run with java version 8.
## Setting up the database
This application uses `postgres` database; create a database on postgres 
and set up the database credentials in the application.yml in lamisplus module

## Maven setup
Use maven 3 upwards, run **mvn dependency:tree** to resolve java dependencies

## Starting the website on your local machine
Just start `coreApplication` with the command **mvn spring-boot:run**.
This will start up the website using a local database on port **8080**. or another user defined port.

Browsing to http://localhost:8080/login should give you the homepage.

## Front-end development
When starting on your local machine, you should get instant reloading of all static files.
Simply make a change and refresh the page in your browser.

All front-end related static files are located in `lamisplus/src/main/resources/static`.

> WARNING: All files in `src/main/resources` will be packaged and deployed with the website.
> Do not put any files anywhere in that folder if they are not supposed to be deployed!

### LiveReload integration
The application supports LiveReload.
If you have the plugin in your browser, just activating it on the site should be enough.

### Front end system
The application is built using react native for frontend.

## Troubleshooting
### Resetting the database
Create a database property in the application.yml
