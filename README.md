cinejs
======
[![Build Status](https://travis-ci.org/sfoubert/cinejs.svg?branch=master)](https://travis-ci.org/sfoubert/cinejs)

Node JS Application for Cinema Management
```sh
  $ git clone https://github.com/sfoubert/cinejs.git
  $ npm install
```

Ne pas oublier dans le fichier app.js, les variables environnement suivantes :
```sh
APP_ID
APP_SECRET
CONTEXT_PATH
MONGO_URI
```

Lancer serveur
```sh
  $ nodemon app.js
```
Pour activer le livereload
```sh
  $ grunt livereload
```

Lancer le navigateur
 http://localhost:3000/


## Mongo DB
```sh
 D:\Java\mongodb\bin>mongo.exe
 use cinema
 db.movie.remove()
 db.movie.insert({movie:"Stargate"})
 db.movie.find()

 db.getCollectionNames()
```

Dump and restore Mongo DB
```sh
mongo ds055709.mlab.com:55709/cinema -u <username> -p <password>
show collections

mongodump.exe --host ds055709.mlab.com --port 55709 --db cinema --collection user -u <username> -p <password> --out cinema.dump
mongodump.exe --host ds055709.mlab.com --port 55709 --db cinema --collection movie -u <username> -p <password> --out cinema.dump
mongodump.exe --host ds055709.mlab.com --port 55709 --db cinema --collection entry -u <username> -p <password> --out cinema.dump

mongorestore.exe --host localhost --port 27017 --db cinema --collection user cinema.dump/cinema/user.bson
mongorestore.exe --host localhost --port 27017 --db cinema --collection movie cinema.dump/cinema/movie.bson
mongorestore.exe --host localhost --port 27017 --db cinema --collection entry cinema.dump/cinema/entry.bson

```

## Commandes Git
 ```sh
 $ git add .
 $ git rm -r --cached node_modules/
 $ git remove -Rf node_modules/
 $ git diff --cached app.js
 $ git commit -a
 $ git remote add origin https://github.com/sfoubert/cinejs.git
 $ git remote -v
 $ git push -u origin master
 $ git reset --soft HEAD~1
 
## Heroku
 $ heroku login
 $ heroku keys:add
 $ //git remote add heroku git@heroku.com:cinejs.git
 $ heroku git:remote -a cinejs
 $ git push heroku master
 
 ```

## License

GPL
