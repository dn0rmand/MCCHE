# Introduction
MCCHE Basketball website GIT repository. 

The MCCHE Basketball website is located at [http://MCCHEBasketball.com/](http://MCCHEBasketball.com/)

Let this section explain the objectives or the motivation behind this project. 

# Getting Started

First install `nodejs`. Download it from [http://nodejs.org](http://nodejs.org)

Then, from the MCCHE folder, run the following command:

    npm install

this will download and install all the required packages.

For convenience, also install `grunt-cli` and `http-server` with the following commands:

    npm install grunt-cli -g
    npm install http-server -g

# Setup local Website

Build or update the `dist` folder with the command:

    grunt

`dist` is a pre-processed version of `source`

Run the local web server by running the following commands in a separate terminal:

    cd <path to dist folder>
    http-server 

# Build

Each time you modify a file ( html, js, css ... ), you need to re-run the command:

    grunt

If you modified/added an html file, an image ... ( anything but css and js ),  you can also 
just run:

    grunt build

If you modified an existing js file, run the command:

    grunt uglify

For css modification, use this command:

    grunt cssmin

You can also run the following command to listen to files changes and automatically update `dist` 

    grunt watch

# Deploy to MCCHE 

To upload the changes to [ftp://MCCHEBasketball.com/](ftp://MCCHEBasketball.com/) use one of the following command:

    grunt update

or

    grunt deploy

deploy will upload the whole `dist` folder, while update will only upload the html, js and css files

**NOTE**: for now it uploads to [ftp://MCCHEBasketball.com/beta/](ftp://MCCHEBasketball.com/beta/)

# Contribute

Clone this repository with the command:

    git clone https://mcche.visualstudio.com/_git/MCCHE
