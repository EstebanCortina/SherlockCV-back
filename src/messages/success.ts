export default (httpStatusCode: number = 200,
                message: string = "Success",
                data: any = null) => {
    return {
        statusCode: httpStatusCode,
        message: message,
        data: data
    }
}