import { diskStorage } from 'multer';
import { join } from 'path';
import { generate } from 'shortid';

export const storageOptions = diskStorage({
    destination: join(__dirname, '..', '..', 'temp'),
    filename: (req, file, callback) => {
        callback(null, generate());
    },
});
