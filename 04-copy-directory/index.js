function copyDir(){
    const fs = require('fs');
    const { mkdir } = require('node:fs/promises');
    const { join } = require('node:path');

    const projectFolderCopy = join(__dirname, 'files-copy');
    const projectFolder = join(__dirname,'files');

    mkdir(projectFolderCopy, { recursive: true });
    function deleteFiles(){
        fs.readdir(projectFolderCopy,(error,filesСopy)=>{
            if (error) throw error;
            if(filesСopy.length > 0){
                filesСopy.forEach(fileCope=>{
                    const projectFileCopy = join( projectFolderCopy, fileCope);
                    fs.unlink(projectFileCopy, error=>{
                        if (error) throw error;
                    })
                })
            }        
        })
    }
    function copyFiles(){
        fs.readdir(projectFolder,(error,files)=>{
            if (error) throw error;
            files.forEach(file=>{
                const projectFile =join(projectFolder, file);
                const projectFileCopy = join(projectFolderCopy, file);
                fs.promises.copyFile(projectFile,projectFileCopy);
            })
        })
    }
    deleteFiles();
    copyFiles();  
}
copyDir();
