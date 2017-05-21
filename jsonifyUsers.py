#! /usr/bin/python3

import json

admin_dict = []
with open("admin.txt", 'r') as admin:
    for name in admin:
        name = name.replace("\n","")
        admin_dict.append({"name":name})

with open("admin.json", 'w') as admin_json:
    json.dump(admin_dict, admin_json)

bot_dict = []
with open('bot.txt', 'r') as bot:
    for name in bot:
        name = name.replace("\n","")
        bot_dict.append({"name":name})

with open('bot.json', 'w') as bot_json:
    json.dump(bot_dict,bot_json)