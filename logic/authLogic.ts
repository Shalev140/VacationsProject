import { RowDataPacket } from "mysql2";
import { UserModel } from "../models/UserModel";
import { execute } from "../utils/dal";
import { comparePasswords, hashPassword } from "../utils/hash";



export async function register({ firstname, lastName, email, password }: UserModel): Promise<UserModel | RowDataPacket> {
    const checkDuplicateMail = `SELECT * FROM users
    wHERE email = '${email}';`;
    const [data] = await execute<UserModel>(checkDuplicateMail, [email]);
    if (data.length !== 0) {
        throw 'Email already used'
    }

        const role = 1;
        password = await hashPassword(password);
        const query = `INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`;
        const [rows] = await execute<any>(query, [firstname, lastName, email, password, role]);
        const id = rows.insertId
        // console.log(rows);

        return { id, role, firstname, lastName, email, password };

}

export async function login(email: string, password: string): Promise<UserModel | RowDataPacket> {
    const query = `SELECT * FROM users
    wHERE email = '${email}';`
    const [rows] = await execute<UserModel>(query, [email, password]);
    // console.log(rows);
    if (rows.length === 0) {
        throw 'There is no such email'
    }
    const passwordsMatch = await comparePasswords(password, rows[0].password)
    if (!passwordsMatch) {
        throw 'Password incorrect';
    }

    return rows[0];
}

