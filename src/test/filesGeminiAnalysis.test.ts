import dotenv from 'dotenv';
dotenv.config();
import {Request, Response, NextFunction} from "express"
import * as chai from "chai"
import sinon from 'sinon'
import filesGeminiAnalysis from "../middlewares/filesGeminiAnalysis.js";

const expect = chai.expect;

describe('filesGeminiAnalysis', () => {
    it('should add analysis property to the request object', (done) => {
        // Simular los objetos req, res, y next
        const req = {} as Request;
        const res = {} as Response;
        const next = sinon.spy();

        // @ts-ignore
        req.candidatesInfo = [
            {
                content: `Antonio   Álvarez   M  aantonio.am2@gmail.com   /   312 - 131 - 4160   /   Colima,   México  Software   Engineer   Student   |   Backend   enthusias
t  Education   Summary  Antonio Alvarez is a Software Engineer student coursing   six th semester at Universidad de Colima. His interest got sparked
  when   they   taught   him   the   subject   data   structure   and   found   out   that   his   skills   and   the   direction   he   wants   to 
  take   in   his   career  is   to   work   directly   with   the   data   (how   it   is   sent,   how   is   obtained,   how   is   saved   and  
 the   effectiveness   of   all   above   mentioned.)  In these moments,   he’s   exploring   and refining his knowledge to build his career path.  
Summary   of   Qualifications  Programming   Languages   &   Frameworks  ●   JavaScript:   Node.js,   Express.js   [basic - intermediate]  ●   PHP  
 [ Intermediate }  ●   C++ {basic}  Databases  ●   Relational:   MySQL   {intermediate]  ●   NoSQL:   MongoDB   [little}  Web   Development  ●   HTM
L5  Server   &   DevOps  ●   Servers:   Apache   [Little]  ●   Cloud   Services:   Digital   Ocean   [Little]  ●   Containers:   Docker   [Little]  
Software   Development   Management  ●   Code   Versioning:   Git/Github  Language:     English:   B2   (British Council Certficate :   https://eng
sco.re/ad8054f5 )  o   Speaking   [intermediate]  o   Listening   [I ntermediate - advanced]  o   Writing   [I ntermediate]  o   Reading   [Proficie
nt]  Softskills:     Stress   management     Problem - solving     Logical   thinking     Desire to   learn.     Respectfulness     Accepting   feedback
Relevant   Projects  ●   Business - APIs   https://github.com/SczSca/Business - APIs  ●   gRPC - demo   https://github.com/SczSca/gRPC - demo  ●   B
 ack - end app using firebase   https://github.com/SczSca/backend_ExpressFirebase  ●   Front - end app using firebase auth   https://github.com/SczS
ca/express_firebaseAuth  ●   Basic   CRUD   (PHP   |   HTML   |   JS   |   MySQL)   https://github.com/SczSca/DBproyecto  ●   Rest API test (Express
.js | mysql2 | uuid | bcryptjs | jsonwebtoken | cors) :  https://github.com/SczSca/restApiExpress  ●   ESP32   project   using   web   socket   and 
  MQTT   servers   to   get   bulbs’   data:  https://github.com/SczSca/Esp32_PubSubclient  ●   Data   structure   mini   projects:   https://github
.com/SczSca/tareaEstructuraDatos  ●   Chat   app   using   web   sockets :   https://github.com/SczSca/chatUsingWebSocket  ●   CRUD   using   expres
s.js :   https://github.com/SczSca/webApiExpress  ●   Github:   https://github.com/SczSca  Career   History  Universidad   de   Colima   CENEDIC   d
epartment   –   Backend   Developer   Intern   (SSC)   -   https://educ.ucol.mx  June   2023   –   March   2024  Currently,   as   a   Backend   Dev
eloper   Intern,   he   is   responsible   of:  1.   Currently   honing   my   skills   in   crafting   API   documentation.   Actively   learning  
 how   to   create   clear,   user - friendly   guides  for developers, ensuring they can efficiently integrate APIs into projects.  2.   In   the  
 process   of   exploring   the   shift   from   a   View/Controller   structure   to   an   API - centric   one.   Learning   to   optimize  system
   performance and scalability while working on strategies for seamless data   flow, all part   of my ongoing  journey   towards   becoming   a   pr
oficient   developer.  3.   Collaborated   closely   with   the   CENEDIC   team   at   the   University   of   Colima   to support   and   enhance 
their   web - based  educational   service.  4.   Assisted   in   troubleshooting   and   debugging   code   issues,   ensuring   the   smooth   ope
ration   of   the   educational   service.  5.   Worked   closely   with   educators   and   administrators   to   gather   feedback   and   impleme
nt   necessary improvements   to  the   platform.  Education  Campoverde   Highschool   - Colima,   México   2018   –   2021  University   of   Colima   –   Software   Engineer   –   Colima,   Mexico   August   2021   –   Present
`
            },
            {
                content: `bachelor's degree  • Outstanding Student Diploma, 2021  Bachiller in Analyst Programmer  EDUCACIÓN  EXPERIENCIA LABORAL  PORFIRIO DANIEL  JAIME MONR
EAL  P R O G R A M M E R T E C H N I C A L  A N A L Y S T  I am a hard-working person who is  always committed to the work I have  to do and no matt
er what problem I  face, I will solve it. I am also a  sociable person who can empathize  with my co-workers, which  promotes better communication  
Correo:pjaimemonreal@gmail.com  Github: Moonreal  Celular: (312) 167 2211  Participation in NASA SPACE APPS  Creation of speech and presentation of 
our  product. • Assistance in the development of an  app using java and mongodb.  Freelancer  Facultad de telematica UDC  2021-Progress  Ing. in Sof
tware  LANGUAGES  ENGLISH  Oral Level B2+. Written Level B2+.  Certification by English Score  CONTACTO  Programming Languages  • HTML.  • Java Scrip.  • PHP.  • SQL.  • CSS.  • WORKBENCH MYSQL.  SPANISH  "Bilingual Oral Level. Advanced Written  Level
`
            }
        ]
        filesGeminiAnalysis(req, res, ()=>{
            done()
            // Verificar que el middleware haya modificado req como se espera
            // @ts-ignore
            const response = JSON.parse(req.analysis);
            expect(response).to.be.an('array');
            expect(response[0]).to.have.property('lugar');

            // Verificar que next() haya sido llamado
            expect(next.calledOnce).to.be.true;
        });
    });
});
