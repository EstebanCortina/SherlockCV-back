import type { Response, Request} from "express";
import success from "../messages/success.js";
import badRequest from "../messages/error/badRequest.js";
import JobPositionModel from "../models/JobPositionModel.js";

const controllerModel = new JobPositionModel();

export default class JobPositionsController {

    /**
     * Handles the request to retrieve job positions for the authenticated user.
     *
     * This asynchronous function interacts with the controller model to fetch
     * job positions associated with the current user ID from the request object.
     * It then sends a successful response with the retrieved job positions.
     *
     * @async
     * @function indexAsync
     * @param {Request} req - The HTTP request object, expected to contain a `userId` property.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<void>} Sends a response with a status of 200 and the job positions data.
     */
    async indexAsync(req: Request, res: Response): Promise<void> {

        const jobPositions = await(
            controllerModel
                .index()
                .where("user_id=?")
        ).run([req.userId])

        res.status(200).send(success(
            200,
            "Job Positions",
            jobPositions)
        );
    }


    /**
     * Handles the request to retrieve a specific job position for the authenticated user.
     *
     * This asynchronous function fetches a job position by its ID and the user's ID from the request object.
     * It validates the existence of the job position and sends an appropriate response.
     *
     * @async
     * @function showAsync
     * @param {Request} req - The HTTP request object, expected to contain `params.id` for the job position ID and a `userId` property.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<any>} Sends a response with a status of 200 and the job position data if found, otherwise sends a 404 response.
     */
    async showAsync(req: Request, res: Response): Promise<any> {

        const jobPosition = await(
            controllerModel.getJobPositionById(req.params.id, req.userId)
        );

        if (!JobPositionsController.validateJobPosition(jobPosition)) {
            return res.status(404).send(badRequest(
                400, "Job Position Not found"
            ))
        }

        res.status(200).send(success(
            200,
            "Job Position",
            jobPosition)
        );
    }


    /**
     * Handles the request to create a new job position for the authenticated user.
     *
     * This asynchronous function assigns the user's ID to the job position data from the request body,
     * then creates the new job position in the database. It sends a response indicating the successful creation.
     *
     * @async
     * @function createAsync
     * @param {Request} req - The HTTP request object, expected to contain job position data in the body and a `userId` property.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<void>} Sends a response with a status of 201 and the newly created job position data.
     */
    async createAsync(req: Request, res: Response): Promise<void> {

        req.body.user_id = req.userId;
        req.body.key_points = JSON.stringify(req.body.key_points);
        const newJobPosition = await(
            controllerModel.create(
                req.body,
                true)
        ).run();

        res.status(201).send(success(
            201,
            "Job Position Created",
            newJobPosition)
        );
    }

    /**
     * Handles the request to update a specific job position for the authenticated user.
     *
     * This asynchronous function fetches a job position by its ID and the user's ID from the request object.
     * It validates the existence of the job position, updates it with the new data from the request body, and sends an appropriate response.
     *
     * @async
     * @function updateAsync
     * @param {Request} req - The HTTP request object, expected to contain `params.id` for the job position ID, a `userId` property, and the update data in the body.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<any>} Sends a response with a status of 200 and the updated job position data if the update is successful, otherwise sends a 404 response.
     */


    async updateAsync(req: Request, res: Response): Promise<any> {

        if (req.body.key_points) {
            req.body.key_points = JSON.stringify(req.body.key_points);
        }

        const jobPositionToUpdate = await(
            controllerModel.getJobPositionById(req.params.id, req.userId)
        );

        if (!JobPositionsController.validateJobPosition(jobPositionToUpdate)) {
            return res.status(404).send(badRequest(
                400, "Job Position Not found"
            ))
        }

        const updatedJobPosition = await(
            controllerModel.update(
                req.body,
                true)
                .where(`id='${req.params.id}'`)
        ).run();

        res.status(200).send(success(
            200,
            "Job Position Updated",
            updatedJobPosition)
        );
    }


    /**
     * Handles the request to toggle the "is_open" status of a specific job position for the authenticated user.
     *
     * This asynchronous function fetches a job position by its ID and the user's ID from the request object.
     * It validates the existence of the job position, toggles its "is_open" status, updates the job position in the database, and sends an appropriate response.
     *
     * @async
     * @function toggleIsOpenAsync
     * @param {Request} req - The HTTP request object, expected to contain `params.id` for the job position ID and a `userId` property.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<any>} Sends a response with a status of 200 and the updated job position data if the update is successful, otherwise sends a 404 response.
     */
    async toggleIsOpenAsync(req: Request, res: Response): Promise<any> {

        const jobPositionToUpdate = await(
            controllerModel.getJobPositionById(req.params.id, req.userId)
        );

        if (!JobPositionsController.validateJobPosition(jobPositionToUpdate)) {
            return res.status(404).send(badRequest(
                400, "Job Position Not found"
            ))
        }

        const updatedJobPosition = await(
            controllerModel.update(
                {"is_open": jobPositionToUpdate.is_open === 1 ? 0 : 1},
                true)
                .where(`id='${req.params.id}'`)
        ).run();

        res.status(200).send(success(
            200,
            "Job Position Updated",
            updatedJobPosition)
        );
    }


    /**
     * Handles the request to softly delete a specific job position for the authenticated user.
     *
     * This asynchronous function fetches a job position by its ID and the user's ID from the request object.
     * It validates the existence of the job position, performs a soft delete on the job position, and sends an appropriate response.
     *
     * @async
     * @function deleteSoftAsync
     * @param {Request} req - The HTTP request object, expected to contain `params.id` for the job position ID and a `userId` property.
     * @param {Response} res - The HTTP response object used to send the response.
     * @returns {Promise<any>} Sends a response with a status of 200 and a message indicating the job position has been softly deleted if successful, otherwise sends a 404 response.
     */
    async deleteSoftAsync(req: Request, res: Response): Promise<any> {

        const jobPositionToDelete = await(
            controllerModel.getJobPositionById(req.params.id, req.userId)
        );

        if (!JobPositionsController.validateJobPosition(jobPositionToDelete)) {
            return res.status(404).send(badRequest(
                400, "Job Position Not found"
            ))
        }

        const deletedJobPosition = await(
            controllerModel.delete_soft()
                .where(`id=?`)
        ).run([req.params.id]);

        res.status(200).send(success(
            200,
            "Job Position Deleted",
            deletedJobPosition)
        );
    }


    /**
     * Validates the existence of a job position.
     *
     * This function checks if the provided job position is not empty, indicating that the job position exists.
     *
     * @function validateJobPosition
     * @param {Object} jobPosition - The job position data to validate, expected to be an array.
     * @returns {boolean} Returns `true` if the job position array is not empty, otherwise `false`.
     */
    static validateJobPosition(jobPosition: Object): boolean {
        return Object.keys(jobPosition).length > 0
    }
}