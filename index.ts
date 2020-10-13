import redis from "redis";
import { promisify } from "util";
import { connect } from "mongodb";
import { Client } from "pg";
import { v4 } from "uuid";
import neo4j from "neo4j-driver";
import { neo4jSeed } from "./neo4j-seed";

// cache the following database call: getData(id: string). A cache entry should be alive for 1 hour at most
const redisTest = async () => {
  const redisClient = redis.createClient({ port: 6379 });

  // needed redis functions promisified, for your convinience :)
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const setAsync = promisify(redisClient.set).bind(redisClient);
  const delAsync = promisify(redisClient.del).bind(redisClient);

  const getData = (id: string) => id.repeat(69);
  const setData = (_id: string, _val: unknown) => {
    "setting data beep boop";
  };

  // GET /data/:id
  const getHandler = (req: { id: string }) => {
    // cache this call
    const data = getData(req.id);
  };

  // PUT /data/:id
  const updateHandler = (req: { id: string; val: unknown }) => {
    setData(req.id, req.val);
  };
};

export type Person = {
  name: string;
  favoriteFoods: string[]; // n-m relation
  metadata: { [key: string]: string }; // can be anything
};

// store Person in both mongo and pg
// for pg, use at least 3rd normalform
// as a comparison, write a query that:
// returns the amount of favoriteFoods a given Person has, if the 'status' metadata field is set to 'working'.
// test the queries with mock data
const mongoTest = async () => {
  const mongoClient = await connect("mongodb://localhost:27017");
  const mongodb = mongoClient.db("test");
  // await mongodb.collection("asd")...;
};

const pgTest = async () => {
  const pgClient = new Client({
    user: "user",
    password: "password",
    port: 5432,
    host: "localhost",
    database: "test",
  });
  await pgClient.connect();
  // await pgClient.query("CREATE TABLE IF NOT EXISTS ...");
};

// neo4j is prefilled with data with the following schema
// NODES: Category and Product, Customer
// RELATIONS: IS_IN, ADDED_TO_WISH_LIST, VIEWED, BOUGHT
// obtain a list of notebooks that customers have viewed or added to their wish lists
// recommend Products to Customers. If a Customer BOUGHT at least 2 items another Customer
// has bought, recommend all items to the Customer the other customer has ADDED_TO_WISHLIST
const neo4jTest = async () => {
  const driver = neo4j.driver("neo4j://localhost:7687");
  const session = driver.session();
  const result = await session.run(neo4jSeed);
  console.log({ result });
};

(async () => {
  await redisTest();
  await mongoTest();
  await pgTest();
  await neo4jTest();
})().catch(console.error);
