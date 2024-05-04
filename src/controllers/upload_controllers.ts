import {Request, Response} from 'express';

export default (req: Request, res: Response): void => {
  const pdfFiles = req.files
  console.log(pdfFiles)
  res.status(200).send({"mensaje": "Archivos subidos con exito"});
};
