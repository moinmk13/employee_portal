// @ts-ignore
import multer from 'multer';
import fs from 'fs';
import util from 'util';

const unlinkAsync = util.promisify(fs.unlink);

class FileUploadHandler {
    public storage = multer.diskStorage({
        // @ts-ignore
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        // @ts-ignore
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    public upload = multer({ storage: this.storage });

    public deleteFile = async (filePath: string): Promise<void> => {
        try {
            await unlinkAsync(filePath);
            console.log(`File deleted successfully: ${filePath}`);
        } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
        }
    };
}

const fileUploadHandler = new FileUploadHandler();

export default fileUploadHandler;
