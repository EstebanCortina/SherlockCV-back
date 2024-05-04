export default (req, res) => {
  const pdfFiles = req.files;
  res.status(200).send("Archivos subidos con éxito");
};
