# Setup Guide

## Create Slack Bot

Go to `http://my.slack.com/services/new/bot` and copy the API token.

Update `heroku-config.sh` (is executed later on).


## Create Heroku App

Follow `https://devcenter.heroku.com/articles/git`:

Create a new node App through the Heroku online console and connect it with this
repo with

`heroku git:remote -a <app-name>`

Set env variables for the app with `heroku-config.sh from above.

Create and connect a redis instance with

`heroku addons:create heroku-redis:hobby-dev`

Make sure the app has now a `REDIS_URL` environment variable set by heroku.


## Deploy

With

`git push heroku master` or if the GitHub repo is connected to Heroku (see below) simply `git push`.

Make sure no *web* but a *worker* process of this app is started (refer to `Procfile`).

In case `heroku ps` does not state a single worker is running do:

```
heroku ps:scale web=0
heroku ps:scale worker=1
```

If everything is fine `heroku ps` should look like this:

```
=== worker (Free): npm start (1)
worker.1: up 2017/07/15 22:46:57 +0200 (~ 10m ago)
```


## Connect with GitHub for automatic deploys

If the project is on GitHub, the repo should have an origin and a heroku remote:

```
$ git remote -v
heroku  https://git.heroku.com/<heroku-app>.git (fetch)
heroku  https://git.heroku.com/<heroku-app>.git (push)
origin  https://github.com/<user>/<repo>.git (fetch)
origin  https://github.com/<user>/<repo>.git (push)
```

In this case you can connect the GitHub repo within the heroku app and enable automatic deploys
on pushes to the remote origin.
