# ConvoDrill

ConvoDrill is a personal project I made to help me practice speaking other languages. The idea is set up conversations where someone speaks to you, and
you have to respond given a suggestion in your native language. Depending on the answer given, the conversation can branch off in different directions.
It's like a combination of flash cards and "Choose Your Own Adventure".

Another reason for the project was to learn more about full stack development. I followed along to Ben Awad's [full stack tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8)
for much of this project, especially for setting up the necessary tooling for development and deployment. The tech stack is essentially the same as the one featured
in this video.

This is a very early prototype and is meant to showcase the general idea of the app and set up a barebones project to work with. As such, there are some limitations as of current,
including:
 * This will not work on mobile. I have plans to learn some React Native and create a mobile app
 * Speech recognition is limited to [these browsers](https://www.npmjs.com/package/react-speech-recognition#supported-browsers)
 * Only limited to practicing conversations in French (native language being English)
 * Various other areas of the app that need to be improved, especially in the front-end (I'm very new to front-end development)
  
  
Some TODOs and areas of growth include:
 * Building a mobile app for iOS/Android
 * Using a polyfill for speech recognition for better cross-browser support
 * Google/Facebook SSO (more elegant auth in general)
 * Object storage, especially for uploading profile pictures
 * More features for setting up conversations
  * One such example includes having a word list where parts of an answer can be subsituted for a word in the list
 * Ability to see other people's public conversations + other "social media" aspects (friends lists, etc.)
 * More language support (largely depends on the polyfill)
 * A proper index page rather than a redirect
  
You can access ConvoDrill [here](https://www.convodrill.com).
