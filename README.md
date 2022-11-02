# It has been X days

A long time ago I was a web developer. Back then, I could comfortably edit the DOM with simple Javascript, and was pretty good at
Java applets, servlets and eventually a fancy framework called Tapestry. Then my career changed and my skills withered into 
obsolescence. This simple app is my attempt to brush up and learn the FARM stack (FastAPI, React and Mongo) which I think is great.

You can access the app and make a board at [ithasbeen.xyz](http://ithasbeen.xyz). It makes a clean and simple page that says how many days it's been 
since something happened. You can update the number manually, automatically as time passes, and/or set the number via a rest API. 
For the latter, hit `https://api.ithasbeen.xyz/setcount/<boardid>?days=<days>&editkey=<editkey>`. The board ID and editkey respectively are 
the string at the end of the display and edit links in the URL of the page you made. 
