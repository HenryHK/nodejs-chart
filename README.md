# Wikipedia revision history - A simple presentation using nodejs

This is assignment 2 of COMP5347 Web Application Development, The University of Sydney.

## Preprocess

### Start MongoDb

```shell
sudo systemctl start mongodb
sudo mongo
```

### Import Data

Firstly import all revisions into database.

```shell
#!/bin/sh
ls -1 *.json | sed 's/.json$//' | while read col; do 
    mongoimport --jsonArray --db wikipedia --collection revisions < $col.json; 
done
```

Secondly, translate _admin.txt_ and _bot.txt_ using _jsonifyUsers.py_. And import _admin.json_ and _bot.json_

```shell
#import admin
mongoimport --jsonArray --db wikipedia --collection admin admin.json

#import bot
mongoimport --jsonArray --db wikipedia --collection revisions bot.json
```

Finally, regualte the data format in database

```javascript
 
// match admin
db.admin.find().forEach(function(user){
    db.revisions.updateMany(
            {user:user.name},
            {$set:
                {
                    type:"admin"
                }
            }
        );
})

// match bot
db.bot.find().forEach(function(user){
    db.revisions.updateMany(
            {user:user.name},
            {$set:
                {
                    type:"bot"
                }
            }
        );
})

//match regular
db.revisions.updateMany({"anon":{"$exists":false}, "type":{"$exists":false}},{$set:{type:"regular"}})


//change date string to ISODate
db.revisions.find().forEach(function(element){
  element.timestamp = new Date(element.timestamp);
  db.revisions.save(element);
})
```

### Launch the app

Open browser, navigate to `localhost:3000`, have fun.
