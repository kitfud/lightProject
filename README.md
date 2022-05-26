# Candy Lamps

## Running the dApp locally
After downloading the files of this repository, open the prompt on the project root directory and type the following command:

```npm run build```

Be sure to have all required python libraries installed. Run the command:

```pip install -r requirements.txt```

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

Finally, add the local files, commit and deploy to Heroku:

```
git add .
git commit -m "deploying"
git push heroku master
```

Open the app on Heroku and have fun!

A working dApp is running on: https://candy-lamps.herokuapp.com/

## Add CodeOwners
