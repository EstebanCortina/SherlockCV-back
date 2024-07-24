import BaseModel from "../abstract_classes/BaseModel.js";

export default class JobPositionModel extends BaseModel{
    user_id?: string;
    name?: string;
    description?: string;
    key_points?: string[];
    is_open?: number;
    created_at?: Date;
    deleted_at?: Date;
    constructor(){
        super("job_position");
    }

    /**
     * Retrieves a specific job position by its ID and user ID.
     *
     * This asynchronous function fetches a job position from the database using the provided job position ID and user ID.
     * It ensures that the job position has not been deleted by checking that `deleted_at` is `NULL`.
     *
     * @async
     * @function getJobPositionById
     * @param {string} id - The ID of the job position to retrieve.
     * @param {string} [userId=''] - The ID of the user associated with the job position. Defaults to an empty string if not provided.
     * @returns {Promise<any>} A promise that resolves to an array containing the job position data if found.
     */
    async getJobPositionById(id: string, userId: string = ''): Promise<any> {
        return (await (
            this
                .index()
                .where("id=? AND user_id=? AND deleted_at IS NULL")
        ).run([id, userId]))[0]?? {}
    }
}