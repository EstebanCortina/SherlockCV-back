import dotenv from "dotenv";
dotenv.config()

export default async (frontPageImageB64: string)=>{
    if (!process.env.IMAGES_API_URL || !process.env.IMAGES_API_KEY){
        throw new Error("No IMAGES_API_URL or IMAGES_API_KEY")
    }

    const formData = new FormData();
    formData.append('image', frontPageImageB64);

    return fetch(`${process.env.IMAGES_API_URL}?key=${process.env.IMAGES_API_KEY}`, {
        method: 'POST',
        body: formData
    })
}