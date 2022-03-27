import consts from '../const/consts';
import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
   type: "postgres",
   name: consts.TYPEORM_CONNECTION_NAME,
   host: process.env.DB_HOST,
   port: Number(process.env.POSTGRES_PORT),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   synchronize: true,
   logging: false,
   entities: [
      __dirname + '/../**/*.entity.{js,ts}'
   ],
   migrations: [
      __dirname + "src/migration/**/*.ts"
   ],
   subscribers: [
      __dirname + "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};

export = config;