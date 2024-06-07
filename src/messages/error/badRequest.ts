export default (httpStatusCode: number = 400,
                message: string = "Bad request",
                data: any = null) => {
    return {
        statusCode: httpStatusCode,
        message: message,
        data: data
    }
}