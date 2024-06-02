import {Request, Response} from 'express';

export default (req: Request, res: Response) => {
  // @ts-ignore
  const response = req.analysis
  console.log(response)
  res.status(200).send(response);
};
