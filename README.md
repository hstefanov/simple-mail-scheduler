# Docker Compose

## Quick Start

Using Docker Compose is basically a three-step process:

1. Define your app's environment with a `Dockerfile` so it can be
   reproduced anywhere.
2. Define the services that make up your app in `docker-compose.yml` so
   they can be run together in an isolated environment.
3. Lastly, run `docker-compose up` and Compose will start and run your entire
   app.

## General architecture

![](./docs/architecture.png)

## How to run the app

1. Run `docker-compose up --scale worker=2` or any other number of workers of your choice.
2. This should pull all the needed images on your local machine (node:alpine; redis:alpine, mongo) if not already present and create those for the client, server and worker.
3. You can pass to the command `-d` to run silently in the background. `docker-compose up -d --scale worker=2`
4. Provide your own MailGun API credentials and Domain and place them in **docker-compose.yml** file.
5. After a while all the services should be ready. The client is setup to run on `localhost:3000`
6. When open the client, you will be promped to provide an options of cron-like expression tab, for triggering task, and a from with inputs for origin of the email, recepient and message.
7. When click `Send mail`, the system should write the task into `MongoDB` and push a message into the queue (`Redis`) for all subscribers to Process the message.
   ![](./docs/mongo_tasks.JPG)
8. Any of the subscriber checks wheather the message is not already processed and if not enqueue the message into MailGun API.
9. Please check your spam if you are trying to test with your personal email :)
