import { Request, Response } from 'express';
import ReportModel from "../models/ReportModel.js";
import success from "../messages/success.js";

const reportModel = new ReportModel();

class ReportController {

  /**
   * Lists all reports associated with the current user.
   * @param {Request} req - The Express request object, contains `userId` to filter the user's reports.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - Returns an HTTP response with status code 200 and the list of reports.
   */
  async indexAsync(req: Request, res: Response): Promise<Response> {
    const reports = await (
        reportModel
            .index()
            .where("user_id=?")
    ).run([req.userId]);
    return res.status(200).send(success(
        200,
        "Index Reports",
        reports
    ));
  }

  /**
   * Displays the details of a specific report if it belongs to the user and has not been deleted.
   * @param {Request} req - The Express request object, contains `params.id` and `userId` to identify the report.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - Returns an HTTP response with status code 200 and the report details.
   */
  async showAsync(req: Request, res: Response): Promise<Response> {
    const report = (await (
        reportModel
            .index()
            .where("id=? AND user_id=? AND deleted_at IS NULL")
    ).run([req.params.id, req.userId]))[0] ?? {};
    return res.status(200).send(success(
        200,
        "Show Report",
        report
    ));
  }

  /**
   * Creates a new report associated with the current user.
   * @param {Request} req - The Express request object, contains `userId` and `analysis` to create the report.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - Returns an HTTP response with status code 201 and the details of the created report.
   */
  async createAsync(req: Request, res: Response): Promise<Response> {
    const newReport = await (
        reportModel
            .create({
              user_id: req.userId,
              job_position_id: req.body.job_position_id,
              final_analysis: req.analysis
            }, true)
    ).run();

    return res.status(201).send(success(
        201,
        "New Report Created",
        newReport
    ));
  }
}

export default new ReportController();
