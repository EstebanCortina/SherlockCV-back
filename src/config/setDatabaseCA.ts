import dotenv from 'dotenv';
import fs from "fs";

export default () => {
    dotenv.config();
    if (!process.env.DB_PEM) {
        throw new Error("DB_PEM environment variable is missing");
    }

    const sslCert = process.env.DB_PEM;

    const sslCertPath = 'config.pem';

    fs.stat(sslCertPath, (err, stats) => {
      if (err) {
        console.error('Error al obtener las estadísticas del archivo:', err);
        return;
      }
      if (!stats.size) {
          console.log("pem sin contenido");
          fs.writeFileSync(sslCertPath, sslCert);
      }
    });
}