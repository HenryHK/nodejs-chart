###Overall

#### check users

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

db.revisions.updateMany({"anon":{"$exists":false}, "type":{"$exists":false}},{$set:{type:"regular"}})


db.revisions.find({"anon":{"$exists":false}}).forEach(function(revision){
    var admin = db.admin.find({name:revision.user}, {name:1})
    var bot = db.bot.find({name:revision.user}, {name:1})
    if(admin!=null){
        db.revisions.update(
            {user:revision.user},
            {$set:
                {
                    type:"admin"
                }
            }
        );
    }else if(bot!=null){
        db.revisions.update(
            {user:revision.user},
            {$set:
                {
                    type:"bot"
                }
            }
        );
    }else{
        db.revisions.update(
            {user:revision.user},
            {$set:
                {
                    type:"regular"
                }
            }
        );
    }
})

#### The articla with the most number of revisions
```
db.revisions.aggregate([
    {$group:{_id:"$title", numOfRevisions:{$sum:1}}},
    {$sort:{numOfRevisions:-1}},
    {$limit:1}
])
```

#### The articla with the least number of revisions
```
db.revisions.aggregate([
    {$group:{_id:"$title", numOfRevisions:{$sum:1}}},
    {$sort:{numOfRevisions:1}},
    {$limit:1}
])
```

#### The artical edited by largest group of registered users

```
db.revisions.aggregate([
        { '$match': { 'anon': { '$exists': false }, 'type': { '$ne': 'bot' } } },
        { '$group': { '_id': { title: '$title', user: '$user' } } },
        { '$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
        { '$sort': { 'count': -1 } },
        { '$limit': 1 }
])
```

#### The artical edited by samllest group of registered users

```
db.revisions.aggregate([
    {'$match':{'anon':{'$exists':false}}},
    {'$group': { '_id': { title: '$title', user: '$user' } } },
    {'$group': { '_id': { title: '$_id.title' }, 'count': { $sum: 1 } } },
    {'$sort': { 'count': 1 } },
    {'$limit': 1 }
])
```

#### The artical with the longest history

```
db.revisions.aggregate([
    {
        '$group':
        {'_id':{title:'title'}, maxTime:{$max:'$timestamp'}, minTime:{$min:'$timestamp'}}
    },
    {
        '$project':{
            '_id':0,
            'title':'$_id.title',
            'age': {$subtract:['$maxTime', '$minTime']}
        }
    },
    {'$sort':{'age':-1}},
    {'$limit':1}
])
```

#### The artical with the shortest history

```
db.revisions.aggregate([
    {
        '$group':
        {'_id':{title:'title'}, maxTime:{$max:'$timestamp'}, minTime:{$min:'$timestamp'}}
    },
    {
        '$project':{
            '_id':0,
            'title':'$_id.title',
            'age': {$subtract:['$maxTime', '$minTime']}
        }
    },
    {'$sort':{'age':1}},
    {'$limit':1}
])
```

#### Number of user for each year

```
db.revisions.find({})

#### The total number of revisions for selected article

```
db.find({title:*title here*}).count()
```