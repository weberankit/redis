. Why use Redis?
Redis is used to store and retrieve data quickly using key-value pairs. It can act as a fast data-access layer for frequently requested information, reducing repeated calls to the main database.
For example, a website banner message can be stored in Redis and retrieved whenever a user visits the website.
2. Redis key-value pairs
Redis stores data using a key and a value.
Example:
Key   → site:banner
Value → Welcome to our website!


- Key: Identifies the data.
- Value: Contains the stored information.
It is useful to keep Redis keys in constants so the same key is used consistently throughout the application.
const SITE_BANNER_KEY = "site:banner";


3. Connecting to Redis using TypeScript
Using the ioredis package:
import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379"
);


- REDIS_URL specifies the Redis server address.
- localhost refers to your local machine.
- 6379 is the default Redis port used in this setup.
4. Four important Redis commands
A. SET — Store or update a value
await redis.set(SITE_BANNER_KEY, "Welcome to our website!");


- Creates the key if it doesn't exist.
- Updates the value if the key already exists.
- await waits for the asynchronous Redis operation to complete.
B. GET — Retrieve a value
const message = await redis.get(SITE_BANNER_KEY);


- Returns the stored value when the key exists.
- Returns null when the key doesn't exist.
C. EXISTS — Check whether a key exists
const exists = await redis.exists(SITE_BANNER_KEY);


Redis returns:
- 1 — the key exists.
- 0 — the key doesn't exist.
Convert the result to a Boolean when needed:
const result = Boolean(exists);


You can also use !!exists to convert the value to a Boolean.
D. DEL — Delete a key
const deleted = await redis.del(SITE_BANNER_KEY);


Redis returns the number of keys deleted:
- 1 — one key was deleted.
- 0 — the key didn't exist.