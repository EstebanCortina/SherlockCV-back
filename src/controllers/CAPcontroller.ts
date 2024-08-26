import {Request, Response} from 'express';

export default (req: Request, res: Response) => {
  const response = req.analysis
  res.status(200).send(response);
};
