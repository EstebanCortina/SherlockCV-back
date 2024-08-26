import FileIdWelterModel from "../models/FileIdWelterModel.js";
import FileIdHeavyModel from "../models/FileIdHeavyModel.js";
import FileIdLightModel from "../models/FileIdLightModel.js";
import FileIdAbstractModel from "../models/FileIdAbstractModel.js";
import getFileIdHash from "../helpers/getFileIdHash.js";
import extractFileMetaData from "./extractFileMetaData.js";
import uploadImageHandler from "./uploadImageHandler.js";
import getFrontPageBase64 from "../helpers/getFrontPageBase64.js";
import {MetaFile} from "../types/MetaFile.js";
import {cvAbstract} from "../types/cvAbstract.js";


export default async (file: MetaFile): Promise<cvAbstract> =>{
    console.log("Starting... FileID process")
    let cvAbstract: cvAbstract = {} as cvAbstract;

    try {
        // Generate the file hash
        const _fileIdHash = await getFileIdHash(file.buffer);

        // Check if the files is already in FileId
        cvAbstract = (await (
            new FileIdAbstractModel()
                .index([
                    `plain_text_content`, 'meta_data'
                ]).where(`file_id='${_fileIdHash}'`)
        ).run())[0]?? null;

        // If the FileId doesn't exist then create it
        if (!cvAbstract) {
            console.log("Adding file to FileId");
            cvAbstract = await addNewFileId(file, _fileIdHash);
        }else{
            console.log("File already exists");
        }

    }catch (err){
        console.log(`Error handling file ${file.fileName}: ${err}`);
    }

    // At this point the function can return an empty cvAbstract too. But it's ok, just log it.
    return cvAbstract

}

async function addNewFileId(file: MetaFile, newFileIdHash: string): Promise<cvAbstract> {
    let newCvAbstract: cvAbstract = {} as cvAbstract;
    let _new_meta_file = await extractFileMetaData(file);
    /*
        Todo esto tiene que estar adentro de una transacción
    */

    // Save the entire file
    await (
        new FileIdHeavyModel()
            .create({
                file_id: '?',
                data: '?',
            })
    ).run([newFileIdHash, _new_meta_file.buffer]);

    // Save the content as plain_text
    await (
        new FileIdWelterModel()
            .create({
                file_id: "?",
                data: "?"
            })
    ).run([newFileIdHash, _new_meta_file.content]);

    if (!_new_meta_file.buffer) return newCvAbstract;

    // Render the front page and upload the image to the server

    let url:string = await createFrontPageUrl(_new_meta_file.buffer)
    const lightCV = {
        file_name: _new_meta_file.fileName,
        front_page_url: url
    }

    // Save the meta-data of the file
    await (
        new FileIdLightModel()
            .create({
                file_id: newFileIdHash,
                data: JSON.stringify(lightCV),
            })
    ).run();

    // Secure the response type
    newCvAbstract = {
        file_id: newFileIdHash,
        plain_text_content: _new_meta_file.content,
        meta_data: lightCV
    }

    return newCvAbstract
}



async function createFrontPageUrl(fileBuffer: ArrayBuffer): Promise<string> {
    return new Promise(async (resolve, reject) => {
        getFrontPageBase64(fileBuffer).then(
            base64String => {
                uploadImageHandler(base64String).then(
                    imageBBresponse => imageBBresponse.json().then(body=>{
                        resolve(body?.data?.image?.url)
                    })
                ).catch(err => reject(err))
            }
        ).catch(err => resolve("https://img.freepik.com/free-vector/collection-hand-drawn-profile-icons-different-people_23-2149092882.jpg?t=st=1724395464~exp=1724399064~hmac=bba9689675b6478b46ce700fca3e9ac1f61966a5fe34ca914e032993666747e1&w=740"))
    })
}