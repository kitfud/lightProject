# Candy Lamps: An Adaptable Blockchain IoT Interface

Candy Lamps is a solution that provides users with a real world, IoT to blockchain interaction, in a simple, easy to use, and fun experience. Pick a color, and send payment. It’s that easy to use!

## Introduction and context

Our hackathon team wanted to create an interactive, real world use case for blockchain, smart contracts and NFTs. Price feeds and DeFi protocols are cool, but we wanted to create a fun, unique product that users can understand and experience in the real world.

This is where Candy Lamps comes in. Candy Lamps is software powered by blockchain smart contracts that allows people to pay to change the colors of a lighting system. Candy Lamps utilizes the benefits of Web3 technology- allowing lighting systems to be set up locally in a bar, or set up to be accessed from anyone, anywhere in the world. The approach we took was similar to that of an old school diner jukebox. The diner owns the jukebox, and customers can pay a quarter(or a custom amount) to play the song of their choice. Similar to a diner jukebox, owners of a lighting system can allow customers to pay to change the color of the lights.

Setup process for owners: Owners get their own special Admin page for setup, management, and accounting. This page is hidden from non-Admin users. Owners pay to mint an NFT. This NFT is used as a key, similar to a license. Owners can add products (lightstrip 1, lightstrip 2, lightbulb 1, lightbulb 2, patio lights 1, etc) to be associated with that NFT. Each product has an address and when payment is sent to the product address, it triggers that specific lighting product to change color. Funds that have been collected from payment addresses can be withdrawn to the owner’s desired wallet.

Interaction process for users: There are just 2 steps required of users to interact with the lights. Users need to select a color, and then send payment to the address. Simple and easy to use.

## Running the dApp locally
After downloading the files of this repository, open the prompt on the project root directory and type the following command:

```npm run build```

Be sure to have all required python libraries installed. Run the command:

```pip install -r requirements.txt```

You also have to provide a secret key to the socketio application. Put the secret key at line 8 on the app.py file or create a .env file with a variable named SECRET_KEY with a secret assigned to it. 

Now it is all set to run the dApp! Type the following command:

```python app.py``` / ```python3 app.py```

Then, open the browser and go to:

```http://localhost:5000/```

## Running the dApp remotely
To deploy on Heroku, an user account need to be created. Go to the [Heroku](https://www.heroku.com/) webpage and create an user. After that, create an app project on Heroku.

Download and install the Heroku CLI by typing on the prompt (more info [here](https://devcenter.heroku.com/articles/heroku-cli)):

```npm install -g heroku```

Download the files of this repository, go to the project root folder and type the following command on the prompt in order to login to Heroku:

```heroku login```

Then, connect your Heroku project with your local project:

```heroku git:clone -a project-name```

You also have to provide a secret key to the socketio application. Put the secret key at line 8 on the app.py file or create a .env file with a variable named SECRET_KEY with a secret assigned to it. 

Finally, add the local files, commit and deploy to Heroku:

```
git add .
git commit -m "deploying"
git push heroku master
```

Open the app on Heroku and have fun!

A working dApp is running on: https://candy-lamps.herokuapp.com/

## Contracts architecture

The backend 

## Languages, Libraries, Frameworks, and Tools
<div style="background-color: gray;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg" width="40" height="40"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original-wordmark.svg" width="40" height="40"/>
</div>


- [brownie](https://pypi.org/project/eth-brownie/)
- [chainlink-price-feeds](https://docs.chain.link/docs/using-chainlink-reference-contracts/)
- [chainlink-vrfv2](https://docs.chain.link/docs/chainlink-vrf/)
- [ethers.js](https://docs.ethers.io/v5/)
- [ipfs](https://ipfs.io/)
- [metamask](https://metamask.io/)
- [pinata](https://www.pinata.cloud/)


## Add CodeOwners
