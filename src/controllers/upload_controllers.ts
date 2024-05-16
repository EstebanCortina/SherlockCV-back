import {Request, Response} from 'express';

export default (req: Request, res: Response) => {
  const pdfFiles = req.files
  console.log("exito")
  res.status(200).send({"mensaje": "Archivos subidos con exito"});
};
