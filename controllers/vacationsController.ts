import { Router } from "express";
import fileUpload from "express-fileupload";
import { verify } from "jsonwebtoken";
import path from "path";
import { addNewVacation, deleteVacation, editVacation, getAllActiveVacations, getAllFutureVacations, getAllVacations, getAllVacationsThatUserLike, userAddLike, userRemoveLike } from "../logic/vacationsLogic";
import { UserModel, UserRole } from "../models/UserModel";
import { VacationModel } from "../models/VacationModel";
import { secret } from "../utils/jwt";
import sharp from 'sharp';

export const vacationsController = Router();


vacationsController.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;


        ///Get user deatils id and role
        const token = req.headers.authorization.split(' ')[1]
        const user = verify(token, secret) as UserModel;
        const id = user.id;
        const role = user.role;

        const limit = 10;
        const offset = (page - 1) * limit;


        const vacations = await getAllVacations(id, limit, offset);
        // console.log(vacations);

        res.json(vacations);
    } catch (error) {
        res.status(401).json({ error })
    }
})


vacationsController.post('/', fileUpload({ createParentPath: true }), async (req, res) => {
    try {
        const photo = req.files.photo as fileUpload.UploadedFile;
        const vacationObj = JSON.parse(req.body.vacation);
        const vacationData: VacationModel = {
            destination: vacationObj.destination,
            description: vacationObj.description,
            startDate: vacationObj.startDate,
            endDate: vacationObj.endDate,
            price: vacationObj.price,
            photoName: ''

        }
        const result = await addNewVacation(vacationData);
        await sharp(photo.data)
            // .resize(350, 180)
            .png()
            .toFile(path.resolve(__dirname, "..", "assets", `${result.newId}.png`))
        console.log({result})
        res.json(result);
    } catch (error) {
        res.status(401).json({ error })
    }

})

vacationsController.get('/likes-vacations', async (req, res) => {

    try {
        // console.log(res.locals.user);
        const page = parseInt(req.query.page as string) || 1;
        const { userId } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const vacation = await getAllVacationsThatUserLike(limit, offset, +userId);
        res.json(vacation);
    } catch (error) {
        res.status(401).json({ error });
    }

})

vacationsController.get('/active-vacations', async (req, res) => {

    try {
        const page = parseInt(req.query.page as string) || 1;
        const { userId } = req.query;
        // console.log(userId);

        const limit = 10;
        const offset = (page - 1) * limit;

        const vacation = await getAllActiveVacations(limit, offset, +userId);
        res.json(vacation);
    } catch (error) {
        res.status(401).json({ error });
    }

})

vacationsController.get('/future-vacations', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const { userId } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;
        const vacation = await getAllFutureVacations(limit, offset, +userId);
        res.json(vacation);
    } catch (error) {
        res.status(401).json({ error });
    }

})



vacationsController.post('/addLike', async (req, res) => {
try{
    const userId = req.body.userId;
    const vacationId = req.body.vacationId;
    const updateLikes = await userAddLike(userId, vacationId);
    res.json(updateLikes);
}catch(error){
    res.status(400).json({ error });
}
})

vacationsController.post('/removeLike', async (req, res) => {
    try{
        const userId = req.body.userId;
        const vacationId = req.body.vacationId;
        const updateLikes = await userRemoveLike(userId, vacationId);
        res.json(updateLikes);
    }catch(error){
        res.status(400).json({ error });
    }
})

vacationsController.delete('/:id', async (req, res) => {
try{
    const vacationId = req.params.id;
    const deletedVaction = await deleteVacation(+vacationId);
    res.json(deletedVaction);
}catch(error){
    res.status(400).json({ error });    
}

})


vacationsController.patch('/:id', fileUpload({ createParentPath: true }), async (req, res) => {
    try{
        const id = +req.params.id;
        const updatedVacationData = JSON.parse(req.body.vacation);
        const photo = req.files?.photo as fileUpload.UploadedFile;
        if(photo){
            console.log("here should be the photo : ", photo);
            
            await sharp(photo.data)
            .png()
            .toFile(path.resolve(__dirname, "..", "assets", `${id}.png`))
        }
        const updatedVacation = await editVacation({ id, ...updatedVacationData });
        res.json(updatedVacation)
    }catch(error){
        res.status(400).json({ error });
        
    }

})


vacationsController.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        res.sendFile(path.resolve('assetes/' + id + '.png'));

    } catch (error) {
        res.status(400).json({ error });

    }
})