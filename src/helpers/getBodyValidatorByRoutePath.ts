export default (routePath: string): string => {
    return (routePath.split("/").map((part: string) => {
        let param = part.split(":")[1]
        if (param){
            // param = part
            return param.charAt(0).toUpperCase() + param.slice(1)
        }
        //return param.charAt(0).toUpperCase() + param.slice(1)
        return part.charAt(0).toUpperCase() + part.slice(1)
    }).join('')) + "Body.js";
}