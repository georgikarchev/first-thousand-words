## Tests using Postman

# Words
+ GET 		- /words -> return first 20 words orderedBy word alphabetically
+ GET 		- /words?limit=20&skip=0&sortBy=name&orderBy=asc
+ POST		- /words/ - { "word": "hello" }
+ DELETE  - /words/:id
+ PUT			- /words/:id - {"word": "hi", "type": "verb", "isPlural": "true", "published": "true" } (define at least one attribute to change)


# Expressions
1 - create expressions
+ GET 		- /expressions -> return first 20 expressions orderedBy word alphabetically
+ GET 		- /expressions?limit=20&skip=0&sortBy=name&orderBy=asc
+ POST		- /expressions/ - { "word": "hello" }
+ DELETE  - /expressions/:id
+ PUT			- /expressions/:id - {"word": "hi", "type": "verb", "isPlural": "true", "published": "true" } (define at least one attribute to change)


# Dialogues

+ GET			-	/clients/:id/cards?limit=100&skip=0&sortBy=id&orderBy=desc - last created 100 cards
+ GET			- /clients/:id/cards/:cardId - returns data for a single card
+ GET 		- /clients/:id/cards?owner=6412ded1ee8aa118a56a1cc9 <- get cards of a particular owner

+ POST		- /clients/:id/cards -> { "type" : "AlfaKarta", "start" : "2023-03-01T00:00:00.193+00:00", "end" : "2023-04-01T00:00:00.193+00:00", "trainingsLeft" : "20", "paid" : "true", "trainer" : "641234d6f1af71f9f50c9ece" }

+ PUT			-	/clients/:id/cards/:cardId/type												-> { "type" : "BetaKarta" }
+ PUT			-	/clients/:id/cards/:cardId/start											-> { "start" : "2023-03-01T00:00:00.193+00:00" }
+ PUT			-	/clients/:id/cards/:cardId/end												-> { "end" : "2023-04-01T00:00:00.193+00:00" }
+ PUT			-	/clients/:id/cards/:cardId/trainings-left							-> { "trainingsLeft" : "19" }
-- NOT TO BE PART OF THE API ------------ PUT			-	/clients/:id/cards/:cardId/owner											-> { "owner" : "641234f8f1af71f9f50c9ed7" }
+ PUT			-	/clients/:id/cards/:cardId/trainer										-> { "trainer" : "6412345d8121efe7c4f4032e" }
+ PUT			-	/clients/:id/cards/:cardId/notes											-> { "notes" : "Notes about this particular card" }
+ PUT			-	/clients/:id/cards/:cardId/paid												-> { "paid" : "false" }
+ PUT			-	/clients/:id/cards/:cardId/status											-> { "active" : "false" }
+ DELETE 	- /clients/:id/cards/:cardId
+ POST		-	/clients/:id/cards/:cardId/trainings										-> { "trainer" : "6412345d8121efe7c4f4032e", "date" : "2023-03-02T00:00:00.193+00:00" }
+ DELETE	-	/clients/:id/cards/:cardId/trainings/:trainingId										-> { "_id" : "64125131db331e7daa314255" }

# Texts