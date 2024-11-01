import express, { Request } from 'express';
import multer from 'multer';
import { pucExcelController,enggExcelController ,studentController,imagesController,userController,certificateController, BackupController} from '../../controller/index'; 

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const folder=file.fieldname==='zip'?'uploads/images':file.fieldname==='puc'?"uploads/puc":file.fieldname==='engg'? 'uploads/engg':'uploads/certificates';
    cb(null, folder);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {

    const { ID="", type="" } = req.query;

    const date=new Date();
    const filename =file.fieldname==='zip'?`${file.fieldname}-${date.getUTCDate()}${date.getUTCMonth()+1}${date.getUTCFullYear()}-${file.originalname}`:
      file.fieldname==='puc'?`${file.fieldname}-${date.getUTCDate()}${date.getUTCMonth()+1}${date.getUTCFullYear()}-${file.originalname}`:
      file.fieldname==='engg'?`${file.fieldname}-${date.getUTCDate()}${date.getUTCMonth()+1}${date.getUTCFullYear()}-${file.originalname}`:
      `${type}-${ID}-${date.getUTCDate()}${date.getUTCMonth()+1}${date.getUTCFullYear()}-${file.originalname}`;
      ;
    cb(null,filename);
  },
});

const upload = multer({ storage });

//PUC Routes
router.post('/uploadPUCFiles', upload.single('puc'), pucExcelController.uploadExcel);
router.get('/getPUCDetails/:id', studentController.getPUCDetails);
router.get('/getPUCDetailsByBatch/:batch',studentController.getPUCDetailsByBatch);


//Engineering Routes
router.post('/uploadEnggFiles', upload.single('engg'), enggExcelController.uploadExcel);
router.get('/getEnggDetails/:id',studentController.getEnggDetails);
router.get('/getEnggDetailsByBatch/:batch',studentController.getEnggDetailsByBatch);
router.get('/getRankListByBatch/:batch',studentController.getRankListByBatch);

//student images Routes
router.post('/uploadImages',upload.single('zip'),imagesController.uploadImages);
router.get('/getStudentImage/:id',imagesController.getImageById);


router.post('/upload/scannedCopy', upload.single("SCANNED_COPY"),certificateController.storeCertificates);


//CertificateRoutes
router.put('/update/PUCCertificateDate',certificateController.updatePUCIssuedDate);
router.put('/update/EnggCertificateDate',certificateController.updateEnggIssuedDate);


//Authentication Routes
router.post('/signup',userController.singUp);
router.post('/login',userController.login);

//Backup Routes
router.get('/PucBackup',BackupController.pucBackup);
router.get('/EnggBackup',BackupController.enggBackup);

export default router;
