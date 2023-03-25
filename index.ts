import cors from "cors";
import express, { json } from "express";
import path from "path";
import { assetsController } from "./controllers/assetsController";
import { usersController } from "./controllers/authController";
import { reportsController } from "./controllers/reportsController";
import { vacationsController } from "./controllers/vacationsController";




const server = express();

server.use(cors({ origin: ['http://localhost:3000'] }));

server.use(json());


server.use("/assets", assetsController);
server.use(express.static(path.join(__dirname,'public')));

server.use('/api/vacations', vacationsController);
server.use('/api/auth', usersController);
server.use('/api/reports', reportsController);



server.listen(3001, () => {
    console.log('Server listen on port 3001')

})
