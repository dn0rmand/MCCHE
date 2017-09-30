# Introduction
MCCHE Basketball website GIT repository. 

The MCCHE Basketball website is located at http://MCCHEBasketball.com

Let this section explain the objectives or the motivation behind this project. 

Command to deploy:

FTP_PASSWORD=[ze secret password]
curl --verbose --ftp-create-dirs --upload-file uploadfilename --user sons_user:$FTP_PASSWORD ftp://MCCHEBasketball.com/NewVersion/web/

# Getting Started

First install `nodejs` ( http://nodejs.org )

Then, from the MCCHE folder, run the following command
    npm install
this will download and install all the required packages.

For convenience, also install `grunt-cli` and `http-server` with the following commands
    npm install grunt-cli -g
    npm install http-server -g

# Setup local Website

1.	Build with the command
    grunt
This will generate the `dist` folder with the pre-processed files.

2.	Run the local web server by running the following commands in a separate terminal
    cd <path to dist folder>
    http-server 

3.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://www.visualstudio.com/en-us/docs/git/create-a-readme). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
