declare namespace Express {
   export interface Request {
      userId: string,
      bodyValidatorError: {
         "error": string,
         "info": any
      },
      safeBody: {[key: string]: unknown}
   }
}