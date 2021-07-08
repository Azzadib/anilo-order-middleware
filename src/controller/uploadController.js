import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

const pytImgDir = process.cwd() + '/payment'

const uploadPayment = (req, res, next) => {
    try {
        const { orderid } = req.params
        if (!fs.existsSync(pytImgDir)) fs.mkdirSync(pytImgDir)

        const images = []

        let dataUploaded = {
            images
        }

        const form = formidable({ uploadDir: pytImgDir, keepExtensions: true })
        form.on('fileBegin', (key, file) => {

            if (file.name === '') return res.status(400).send({ message: "You have to upload an image." })
            if (file.type.split('/')[0] !== 'image') return res.status(400).send({ message: 'File should be an image.' })

            const specificFolder = pytImgDir + `/${orderid}/`
            if (!fs.existsSync(specificFolder)) fs.mkdirSync(specificFolder)

            file.path = path.join(specificFolder + file.name)

        }).parse(req, async (err, fields) => {
                if (err) return res.status(500).send({ message: `Upload file: ${error}.` })
                if (fields) dataUploaded = { ...dataUploaded, fields: fields }

        }).on('file', (key, file) => {
                const fileName = file.name
                images.push({ key, fileName })

        }).on('end', () => {
                console.log('-> Uploading done')
                req.dataUploaded = dataUploaded
                next()
        })
    } catch  (error) {
        console.log('Upload payment', error)
        return res.status(500).send({ message: "Failed to uplad payment bill." })
    }
}

export default {
    uploadPayment,
}