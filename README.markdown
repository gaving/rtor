# Rtorrent on rails

Experimental rails application for controlling the ever popular rtorrent.

## Screenshots

![main interface!](http://github.com/gaving/rtor/tree/master/site/1.png?raw=true)

## Installation

* Copy the example config file under 'config/config.yml.example to 'config/config.xml'
* Configure the path to your scgi enabled rtorrent location within the config
* Set any other variables as you wish in the config

## Usage

In the current directory, run:
    script/server
to start the internal rails web server.

Visit [http://0.0.0.0:3000](http://0.0.0.0:3000) and hopefully view your torrents.

## Notes

Caveats: Watch out for rtorrent not being able to read the socket due to any
permissions issues where the socket file is.
