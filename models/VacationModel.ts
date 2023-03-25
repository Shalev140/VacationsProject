export interface VacationModel{
    id?: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    photoName: string;
    userLikes?:number;
    totalLikes?: number;
}

export type AddVacationResponse = {
    message: string;
};

export type editVacationResponse = {
    message: string;
};
