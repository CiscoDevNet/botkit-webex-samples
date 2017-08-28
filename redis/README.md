# Botkit Redis sample

This bot illustrates how to store values in Redis.


## How to run

Set the env variable "REDIS_URL" to point to your Redis instance, such as
- devenv: redis://localhost:6379
- heroku: redis://h:YOUR_PASSWORD@ec2-54-86-77-126.compute-1.amazonaws.com:60109       

Command line example for (Mac/Linux) bash users

```shell
REDIS_URL=redis://localhost:6379 PUBLIC_URL=https://55454daa.ngrok.io SPARK_TOKEN=0123456789ABCDEFGHIJ node bot.js
```

From a Windows machine, type:
```shell
set REDIS_URL=redis://localhost:6379
set PUBLIC_URL=https://55454daa.ngrok.io
set SPARK_TOKEN=0123456789ABCDEFGHIJ
node bot.js
```


## Snapshots

### Welcome invite

![](docs/img/welcome.png)


### Help command

![](docs/img/help.png)


### Redis storage in 'users' keyspace 

![](docs/img/save-read.png)


### Redis storage in a custom keyspace 

![](docs/img/activities.png)
