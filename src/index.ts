import * as http from 'http';
import {v4 as uuidv4, validate} from 'uuid';
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
const user4: User = { id: uuidv4(), username: "Kolumb", age: 18, hobbies: ["Design", "BTS"] };
const user5: User = { id: uuidv4(), username: "Vladimir", age: 25, hobbies: ['Reading', 'Tennis'] }
const user6: User = { id: uuidv4(), username: "Antonio", age: 35, hobbies: ["Football", "Business"] };

allUsers.push(user1, user2, user3, user4, user5, user6);

const port: number = process.env.NODE_ENV === 'production' ? parseInt(process.env.PROD_PORT as string) : parseInt(process.env.DEV_PORT as string);

const httpServer = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {

    const reqUrl = new URL(req.url || '', `https://${req.headers.host}`);
    const path = reqUrl.pathname;
    // const query = reqUrl.searchParams;

    try {

        if (req.method === 'GET' && req.url === "/api/users") {
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
        else if (req.method === 'POST' && req.url === "/api/users"){

            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const { username, age, hobbies }: User = JSON.parse(body);
                    if ( !username || !age || !hobbies) {
                        res.statusCode = 400;
                        res.end('Missing required fields');
                    } else {
                        const newUser: User = { id: uuidv4(), username, age, hobbies };
                        allUsers.push(newUser);
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newUser));
                    }
                } catch (error) {
                    res.statusCode = 400;
                    res.end('Wrong request body');
                }
            });
        }
        else if (req.method === 'PUT' && path.startsWith('/api/users/')) {
            const userId = path.slice(11);

            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const { username, age, hobbies }: User = JSON.parse(body);
                    if (!validate(userId)) {
                        res.writeHead(400, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify({error: 'User ID is not uuid'}));
                        res.end();
                    } else {
                        const index = allUsers.findIndex((user) => user.id === userId);
                        if (index === -1) {
                            res.writeHead(404, {'Content-Type': 'application/json'});
                            res.write(JSON.stringify({error: 'User not found'}));
                            res.end();
                        } else {
                            allUsers[index] = { ...allUsers[index], username, age, hobbies };
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(allUsers[index]));
                        }
                    }
                } catch (error) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Invalid request body' }));
                }
            });
        }
        else if (req.method === 'DELETE' && path.startsWith('/api/users/')) {
            const userId = path.slice(11);

            if (!validate(userId)) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({error: 'User ID is not uuid'}));
                res.end();
                return;
            }

            const index = allUsers.findIndex((user) => user.id === userId);
            if (index === -1) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({error: 'User not found'}));
                res.end();
                return;
            }

            allUsers.splice(index, 1);
            res.statusCode = 204;
            res.end(JSON.stringify({ message: 'User deleted' }));
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Resource not found" }));
        }

    } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.write("Internal Server Error");
        res.end();
    }

});

httpServer.listen(port, () => {
    console.log(`Server in ${process.env.NODE_ENV} mode, listening on :${port} port`);
})

module.exports = { httpServer }