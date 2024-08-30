export default (reqAuthHeader: string): string => {
    return reqAuthHeader.split(' ')[1]
}