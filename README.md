MINI HACKATHON 2.0 - TRIVIA BATTLE APP

A Quiz app that is built using this api - https://the-trivia-api.com/docs/v2/ .
The app is purely build on api knowledge and javascript.
Using a single page to navigate through the quiz app

Features and constraints to be followed-

1. User inputs-
check if both users have input their names
check if both names are same and display alert in that case

2. Submit button-
After entering names users get to submit the names and redirect to a new page where they can choose from a list of categories.

3. Categories-
use dropdown(select) for the options that are being fetched from the api
disable the category as soon as the player selects one(use set and has function).

4. Displaying questions-
fetch 6 questions of difficulty level- easy, medium and hard , 2 each with 
scores- 10,15, 20 each respectively and update the scores in the backend

5. Randomise options using random function and validate the answer.

6. Options after end of the quiz-
Either end the game completely and display the scores.
Or choose from the categories which are not previously chosen.
After all the categories are selected the game ends and the players need to start from the beginning.

7. Reset the state of the game- If the same player wishes to keep playing then, reset the     state and let the player choose from other categories.


API calls to fetch questions-

To fetch categories-
https://the-trivia-api.com/v2/categories

To fetch questions- fetch 2 questions of each difficulty level and merge them placing in an array
Easy (10 points) - https://the-trivia-api.com/v2/questions?categories={category}&limit=2&difficulties=easy
Medium (15 points)- https://the-trivia-api.com/v2/questions?categories={category}&limit=2&difficulties=medium

Hard(20 points)-
https://the-trivia-api.com/v2/questions?categories={category}&limit=2&difficulties=hard


