This project aims to create a self-hosted database where the user can keep track of the pieces of media (books, series, etc) they consume, as well as the language in which they were consumed. 

This data would later be used to create a graph of the most used languages by the user. (Not implemented yet)

The project expects a postgresql database with the following columns:

```
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  name TEXT,
  type TEXT,
  language TEXT
);
```

Project also expects a file ".evn" at the root folder containing the credentials and port for the SQL database, as well as the port of the node server (which I set to 3000, If you want to change this port number, you would also have to change it in the ./node/server.js file). Its contents should look something like this:

```
DATABASE_URL=postgres://postgres:postgres_password@localhost:sql_server_port/media
PORT=3000 
```

The current project takes the following types of media:
- Comics
- Visual Novels
- (Animated) Series
- Movies
- Games
- Audiobooks
- Books
- Songs
