import 'dotenv/config';
import express from 'express';
import router from './router/router';
import {dbCreateConnection} from './connection/connection';

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
    return console.log(`server is listening at port ${port}`);
});

(async() => {
    await dbCreateConnection();
})();

console.log('----------------------Server running----------------------');