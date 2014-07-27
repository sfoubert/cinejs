cinejs
======

Node JS Application for Cinema Management
```sh
  $ git clone https://github.com/sfoubert/cinejs.git
  $ npm install
```

Ne pas oublier dans le fichier app.js, les variables suivantes :
```sh
APP_ID
APP_SECRET
CALLBACK_URL
MONGO_URL
```

Lancer serveur
```sh
  $ nodemon app.js
```

Lancer le navigateur
 http://localhost:3000/cinema


## Mongo DB
```sh
 D:\Java\mongodb\bin>mongo.exe
 use cinema
 db.movie.remove()
 db.movie.insert({movie:"Stargate"})
 db.movie.find()

 db.getCollectionNames()
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

## Heroku
 $ heroku login
 $ heroku keys:add
 $ //git remote add heroku git@heroku.com:cinejs.git
 $ heroku git:remote -a cinejs
 $ git push heroku master
 
 ```

## License

GPL