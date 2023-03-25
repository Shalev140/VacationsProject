import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { login, register } from "../logic/authLogic";
import { comparePasswords, hashPassword } from "../utils/hash";
import { verifyToken } from "../middlewares/verifyUser";
import { UserModel } from "../models/UserModel";
import { generateToken } from "../utils/jwt";

export const usersController = Router();

usersController.post('/register', async (req, res) => {
    try{
        const userDeatils: UserModel = {
            firstname: req.body.firstname,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }
        const newUser: UserModel | RowDataPacket = await register(userDeatils);
        // console.log(newUser);
        
        const token = generateToken(newUser);
        // console.log(token);
        
        res.status(201).json(token)

    }
    catch(error){
        res.status(401).json({ error })
    }
    
})

usersController.post('/login', async (req, res) => {
    try {
        ///test HASH
        const test = await hashPassword("1234");
        console.log("here can see the password after HASH", test);

        const verifyHash = await comparePasswords("1234",test);
        console.log(verifyHash);
        ////

        const email = req.body.email;
        const password = req.body.password;

        const userLogin = await login(email, password);
        const token = generateToken(userLogin);

        res.json(token)
    }
    catch (error) {
        res.status(401).json({ error })
    }
})

usersController.get('/loginWithToken', verifyToken, async (req, res) => {
    return res.json(res.locals.user);
})
