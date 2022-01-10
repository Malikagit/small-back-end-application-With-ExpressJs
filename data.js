const md5 = require("md5")

module.exports.toys = [
    {
        "name": "Playstation 4",
        "description": "Famous video game platform",
        "price": 499,
        "category_id": 0
    },
    {
        "name": "Barbie",
        "description": "Pink doll",
        "price": 29,
        "category_id": null
    },
    {
        "name": "Monopoly",
        "description": "Board game $$$",
        "price": 59,
        "category_id": 1
    },
    {
        "name": "Football ball",
        "description": "A ball to play outside",
        "price": 25,
        "category_id": 2
    },
    {
        "name": "Chess",
        "description": "Board game for smart children",
        "price": 25,
        "category_id": 1
    },
    {
        "name": "montre kidizoom",
        "description": "smartWatch high tech",
        "price": 30,
        "category_id": 6
    }
]

module.exports.categories = [
    {
        "name": "Videogames"
    },
    {
        "name": "Boardgames"
    },
    {
        "name": "Outdoor"
    },
    {
        "name": "High Tech"
    }
]
module.exports.elves = [
    {

        "first_name": "Lmantiri",
        "last_name": "malika",
        "login": "malika",
        "password": md5("mypass")
    },
    {

        "first_name": "jack",
        "last_name": "tristan",
        "login": "tristanjak",
        "password": md5("mypass1")
    },
    {

        "first_name": "curie",
        "last_name": "merry",
        "login": "marieCurie",
        "password": md5("mypass2")
    }]
module.exports.wishes = [
    {
        "toy_id": 1,
        "nameChild": "Cloe",
    },
    {
        "toy_id": 2,
        "nameChild": "Yara",
    },
    {
        "toy_id": 3,
        "nameChild": "Khadidja",
    },
    {
        "toy_id": 1,
        "nameChild": "Emilie",
    }

]
