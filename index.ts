import * as http from 'http';
import { createServer } from 'http';
import path from "path";
import url from 'url';
import fs from 'fs';
import querystring from 'querystring';
import cluster from "node:cluster";
import os from 'node:os';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv'
dotenv.config()


type User = {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

const user: User = {
    id: "smth",
    username: "Jamshid",
    age: 25,
    hobbies: ['Coding', 'Football', 'Reading']
}

enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

const data: Buffer = fs.readFileSync('./usersData.json');
let users: any = JSON.parse(data.toString());

const httpServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {

    const urlparse: url.UrlWithParsedQuery = url.parse(req.url!, true);

    if(urlparse.pathname == 'api/users' && req.method == 'GET')
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users, null, 2));
    }

});

// const httpServer = createServer();
//
// let PORT;
//
// process.env.STATUS === 'production'
//     ? (PORT = process.env.PROD_PORT)
//     : (PORT = process.env.DEV_PORT);
// httpServer.listen(PORT, () => {
//     console.log(`Server in ${process.env.STATUS} mode, listening on *:${PORT}`);
// })