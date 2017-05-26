/**
 * Created by MushrChun on 14/5/17.
 */
var fs = require('fs');
var adminFile = fs.readFileSync('./admin.txt', 'utf8');
var admin = new Array();
adminFile.split("\n").forEach((item) => {
    admin.push(item.trim());
});


var botFile = fs.readFileSync('./bot.txt', 'utf8');
var bot = new Array()
botFile.split("\n").forEach((item) => {
    bot.push(item.trim());
});

module.exports.hasAnon = function hasAnon(item) {
    // console.log('anon'+item['anon'])
    if (item['anon'] == undefined)
        return false;
    else {
        return true;
    }
}

module.exports.checkBot = function checkBot(item) {
    var count = 0;
    // console.log('in check admin'+item)
    bot.forEach((bot_item) => {
        if (bot_item == item) {
            count++;
        }
        // console.log(bot_item)
    });
    // console.log(count);
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.checkAdmin = function checkAdmin(item) {
    var count = 0;
    // console.log('in check admin'+item)
    admin.forEach((admin_item) => {
        if (admin_item == item) {
            count++;
        }
        // console.log(admin_item)
    });
    // console.log(count);
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}