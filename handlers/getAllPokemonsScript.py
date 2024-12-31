import pymongo

myclient = pymongo.MongoClient("mongodb+srv://testUser:eQKQHtYpoE0nQlbs@cluster0.jehzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mydb = myclient["db_pokemons"]
mycol = mydb["pokemon_data"]

mydict = { "name": "John", "address": "Highway 37" }

x = mycol.insert_one(mydict)