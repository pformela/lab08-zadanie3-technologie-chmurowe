const express = require("express");
const redis = require("redis");
const sql = require("./db");

const app = express();

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();

  console.log("Connected to Redis");
})();

async function getUsers() {
  const users = await sql`
    select
      name,
      age
    from users
  `;
  return users;
}

async function insertUser({ name, age }) {
  const users = await sql`
    insert into users
      (name, age)
    values
      (${name}, ${age})
    returning name, age
  `;
  return users;
}

app.use(express.json());
app.set("redisClient", redisClient);

app.get("/messages", (req, res) => {
  const redisClient = req.app.get("redisClient");

  redisClient
    .lRange("messages", 0, -1, (err, messages) => {})
    .then((result) => {
      res.status(200).send({
        status: "OK",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        status: "Internal server error",
      });
    });
});

app.post("/messages", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Bad request");
  }

  const redisClient = req.app.get("redisClient");

  redisClient
    .rPush("messages", message, (err) => {})
    .then((result) => {
      res.status(200).send({
        status: "OK",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        status: "Internal server error",
      });
    });
});

app.get("/users", (req, res) => {
  getUsers()
    .then((result) => {
      res.status(200).send({
        status: "OK",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: "Internal server error",
      });
    });
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send({
      status: "Bad request",
    });
  }

  insertUser({ name: name, age: age })
    .then((result) => {
      res.status(200).send({
        status: "OK",
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: "Internal server error",
      });
    });
});

app.all("*", (req, res) => {
  res.status(404).send("Not found");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
