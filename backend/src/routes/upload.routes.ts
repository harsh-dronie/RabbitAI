import { Router } from 'express'
import { upload } from '../config/multer'
import { uploadController } from '../controllers/upload.controller'
import { validateUpload } from '../middleware/validator'

const router = Router()

router.post('/upload', upload.single('file'), validateUpload, uploadController)

export default router
