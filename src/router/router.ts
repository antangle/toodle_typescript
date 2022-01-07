import express, { Request, Response, NextFunction, query } from 'express';
import {getUser, insertUser} from '../controller/testController';
import testHello from '../controller/testHello';
const router = express.Router();

router.get('/', testHello);
router.get('/test', getUser);
router.post('/test', insertUser);

export = router;