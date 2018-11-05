# Info Map

Gather information collected from the internet, distinguished by provinces.	

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js® is a Must to run the project.

Xampp for apache server and MySQL database.

```
Download the Node.js source code or a pre-built installer for your platform, to start developing.

### Link to download

https://nodejs.org/en/download/

```

### Installing

A step by step series of examples that tell you how to get a development env running

All files and modules were included in the folder. Apart from node.js, no other installaton is needed.

```

### Process

Open cmd and change directory to locate the folder.
Database and apache server has to start with db table imported

```
With above conditions fulfilled run 'npm start' on cmd should start the server 

```
Default port for Node.js should be 3000. Depending on the device access to it, 
enter the ip address from the server host should be able to access the web.

```

## Useage

(Console log) DB is now connected ! Indicating the server is running correctly.

```
var db = require('./db.js);
For files' route connect to db.

db.connection (function(err) {...}
To start mysql connection module, to access database.

res.render('file name', {param:param});
To pass param to ejs.

app.set('view engine', 'ejs');
View engine with Nodejs has been set to ejs as file extension. HTML will have to convert to ejs to be able to run.

All ejs file is equivalent to HTML syntax. With Embedded JavaScript.
<% JS %>

# Uploading rules

```
Using Excel to upload, all the columns must follow the rules that are written at the index page. Any extra column will trigger the error handler.
Note, Excel file will not be saved in the local drive after all infomation has been inserted to database. File will be removed.

Uploading through the web form, all blanks must be filled. Also there should be no duplicate image file name, otherwise system will not allow the image to store in local drive. It will cause image to override with the most recent upload.

## Deployment

This project is based on node express. 

With ejs file as front-end view, EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.

## Built With

* [Nodejs](https://nodejs.org/en/) - The web framework used
* [MySQL](https://www.mysql.com/) - Database Management
* [Xampp](https://www.apachefriends.org/zh_tw/index.html) - Used to generate server/database


## Authors

* **網頁資訊流覽** - *Initial work* By. LC

## License

This project is licensed under the Ministry of National Defense - Army License

## Acknowledgments
* All information classified
* Penetrating CN web pages
* Info ROC Army
