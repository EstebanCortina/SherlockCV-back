declare namespace Express {
   export interface Request {
      userId: string,
      bodyValidatorError: {
         "error": string,
         "info": any
      },
      safeBody: {[key: string]: unknown},
      candidatesInfo: Array<T>,
      analysis: string
   }
}