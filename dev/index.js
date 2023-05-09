var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as http from 'http';
import { v4 as uuidv4, validate } from 'uuid';
import * as dotenv from 'dotenv';
import process from "node:process";
dotenv.config();
const allUsers = [];
const user1 = {
    id: uuidv4(),
    username: "Jamshid",
    age: 25,
    hobbies: ['Coding', 'Football', 'Reading']
};
const user2 = {
    id: uuidv4(),
    username: "Johnson",
    age: 30,
    hobbies: ["Speeches", "swimming"]
};
allUsers.push(user1, user2);
const port = process.env.NODE_ENV === 'production' ? parseInt(process.env.PROD_PORT) : parseInt(process.env.DEV_PORT);
const httpServer = http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ error: 'User ID is not uuid' }));
            res.end();
        }
        else {
            const user = allUsers.find((user) => user.id === userId);
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ error: 'User not found' }));
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(user));
                res.end();
            }
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Resource not found" }));
    }
}));

httpServer.listen(port, () => {
    console.log(`Server in ${process.env.NODE_ENV} mode, listening on :${port} port`);
});
