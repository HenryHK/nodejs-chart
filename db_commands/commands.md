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

db.revisions.updateMany({},{$set:{timestamp:new Date(timestamp)}})
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
            '$group': {
                '_id': { title: '$title' },
                maxTime: { $max: { "$subtract": ['$timestamp', new Date(1970 - 1 - 1)] } },
                minTime: { $min: { "$subtract": ['$timestamp', new Date(1970 - 1 - 1)] } }
            }
        },
        
        { '$limit': 10 }
])
```

#### The artical with the shortest history

```
db.revisions.aggregate([
    {
            '$group': {
                '_id': { title: '$title' },
                maxTime: { $max: '$timestamp' },
                minTime: { $min: '$timestamp' }
            }
        },
        {
            '$project': {
                '_id': 0,
                'title': '$_id.title',
                'age': { $subtract: [new Date('$maxTime'), new Date('$minTime')] }
            }
        },
        {
            '$sort': { 'age': 1 }
        },
        { '$limit': 1 }
])
```

#### Number of user for each year

```
db.revisions.find({})

#### The total number of revisions for selected article

```
db.find({title:*title here*}).count()
```
