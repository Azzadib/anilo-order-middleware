import fs from 'fs'
import path from 'path'

const pytImgDir = process.cwd() + '/payment'

const download = (req, res) => {
    try {
        const { orderid } = req.params
        const filename = `${pytImgDir}/${orderid}/${req.body.filename}`

        if (!fs.existsSync(path.join(filename))) return res.status(404).send({ message: 'File not found.' })

        res.download(filename)
    } catch (error) {
        console.log('Download', error)
        return res.status(500).send({ message: "Failed to dwnload image." })
    }
}

export default {
    download,
}