Cloudburst
==========

Channels for Soundcloud. Name pending.


About
-----

This is both a project for my interface class as part of the HCI curriculum at CMU, 
and also a way for me to learn AngularJS,
and also a project I've been dying to work on for a while. 


The idea is to allow a user to group artists on soundcloud up into what I'm calling "channels," or 
segments of a feed. That way, if I listen to hip hop, deep house, and folk music, I can group the people
I follow into their respective groups. 


Installation
------------

Everything should be bundled and ready to go. Just throw the whole thing on a webserver and 
navigate to index.html. At some point, I hope to turn this into a plugin and / or make it backed by some
sort of service.

If you want the ability to log in properly, you need to edit the configuration (at the top of controllers/channel.js)
with the appropriate path to the callback url (callback.html in the root directory). You'll additionally need to edit the same setting in the app
configuration on Soundcloud's app management page.


Dependencies
------------
	
The app is leaning on the following libraries / SDK's:
 * [Soundcloud](http://developers.soundcloud.com/)
 * [AngularJS](http://angularjs.org/)
 * [LoDash](http://lodash.com/)
