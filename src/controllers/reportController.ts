import {Request, Response} from 'express';
import ReportModel from "../models/ReportModel.js";
import success from "../messages/success.js";

const reportModel = new ReportModel()

class ReportController {

  async indexAsync(req: Request, res: Response): Promise<Response> {
    const reports = await (
        reportModel
            .index()
    ).run()
    return res.status(200).send(success(
        200,
        "Index Reports",
        reports
    ));
  }

  async showAsync(req: Request, res: Response): Promise<Response> {
    const report = await (
        reportModel
            .find(req.params.id)
    ).run()
    return res.status(200).send(success(
        200,
        "Show Report",
        report
    ));
  }


  async createAsync(req: Request, res: Response): Promise<Response> {
    const newReport = await (
        reportModel
            .create({
              final_analysis: req.analysis
            }, true)
    ).run()

    return res.status(200).send(success(
        200,
        "New Report",
        newReport
    ));
  }
}

export default new ReportController();
