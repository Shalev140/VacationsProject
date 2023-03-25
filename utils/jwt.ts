import { UserModel } from "../models/UserModel";
import {sign} from "jsonwebtoken"
import { RowDataPacket } from "mysql2";

export const secret = 'sss';

export function generateToken(user: UserModel | RowDataPacket){
    return sign(user, secret, {expiresIn: "2h"});
}
