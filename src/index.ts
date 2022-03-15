import 'dotenv/config';
import express from 'express';
import mainRouter from './router/mainRouter';
import {dbCreateConnection} from './connection/connection';

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', mainRouter);

app.listen(port, () => {
    return console.log(`server is listening at port ${port}`);
});

(async() => {
    await dbCreateConnection();
})();

console.log('----------------------Server running----------------------');