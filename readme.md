# NodeLogger

This is a simple node server with MongoDB useful for logging events

## Getting Started

You need docker! So far only the development environment is available and can be set up using the command 

```
docker-compose -f "docker-compose-test.yml" up
```
you should have the server listening on port 3000 and and a Mongo-Express instance listening on port 8081 for administration tasks.
```
Node-Express default user: admin
Node-Express default password: admin
```

### Api calls

http://127.0.0.1:3000/api/logs

verbs supported:
```
GET
POST
```

http://127.0.0.1:3000/api/logs:id
```
GET
DELETE
```

### Visual studio Code
this project has been developed with visual studio code and the launch configuration is included in the repository.
With this launch configuration you can attach the debugger in the Docker's container.
