import Memcached from "memcached";
import * as dotenv from "dotenv";
import * as path from "path";

const envPath = process.env.NODE_ENV === "test" ? `.env.test` : ".env";
dotenv.config({ path: path.join(process.cwd(), envPath) });

if (
  process.env.MEMCACHED_HOST == undefined ||
  process.env.MEMCACHED_PORT == undefined
) {
  throw new Error(
    `MEMCACHED_HOST and MEMCACHED_PORT is must not be undefined. ${JSON.stringify(
      { host: process.env.MEMCACHED_HOST, port: process.env.MEMCACHED_PORT }
    )}`
  );
}
const memcachedLocation = `${process.env.MEMCACHED_HOST}:${
  process.env.MEMCACHED_PORT
}`;

let memcachedConnection: Memcached | undefined;

export default (() => {
  if (memcachedConnection) {
    return memcachedConnection;
  } else {
    return (memcachedConnection = new Memcached(memcachedLocation));
  }
})();
