import * as http from 'http';
import { createServer } from 'http';
import path from "path";
import url from 'url';
import fs from 'fs';
import querystring from 'querystring';
import cluster from "node:cluster";
import os from 'node:os';
import {v4 as uuidv4, V4Options, validate} from 'uuid';
import * as dotenv from 'dotenv';
import process from "node:process";
dotenv.config()

interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

const allUsers: User[] = [];

const user1: User = { id: uuidv4(), username: "Jamshid", age: 25, hobbies: ['Coding', 'Football', 'Reading'] }
const user2: User = { id: uuidv4(), username: "Franchesko", age: 34, hobbies: ['Public speaking', 'Arts', 'Netflix'] }
const user3: User = { id: uuidv4(), username: "Diana", age: 26, hobbies: ["Coding", "swimming"] };
const user4: User = { id: uuidv4(), username: "Kostya", age: 18, hobbies: ["Design", "BTS"] };
const user5: User = { id: uuidv4(), username: "Vladimir", age: 25, hobbies: ['Reading', 'Tennis'] }
const user6: User = { id: uuidv4(), username: "Leo", age: 35, hobbies: ["Football", "Business"] };


allUsers.push(user1, user2, user3, user4, user5, user6);

const port: number = process.env.NODE_ENV === 'production' ? parseInt(process.env.PROD_PORT as string) : parseInt(process.env.DEV_PORT as string);

const httpServer = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {

    const reqUrl = new URL(req.url || '', `https://${req.headers.host}`);
    const path = reqUrl.pathname;
    const query = reqUrl.searchParams;

    if (req.url === "/api/users" && req.method === 'GET') {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(allUsers));
        res.end();
    }
    else if (req.method === 'GET' && path.startsWith('/api/users/')) {
        const userId = path.slice(11);
        if (!validate(userId)) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({error: 'User ID is not uuid'}));
            res.end();
        } else {
            const user = allUsers.find((user) => user.id === userId);
            if (!user) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({error: 'User not found'}));
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(user));
                res.end();
            }
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Resource not found" }));
    }

});

httpServer.listen(port, () => {
    console.log(`Server in ${process.env.NODE_ENV} mode, listening on :${port} port`);
})
