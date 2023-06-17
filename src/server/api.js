
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import multer from 'multer'

import fontRenamer from '../lib/font-renamer.js'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

const cleanUploads = () => {
    const p = path.join(path.resolve(), 'uploads')
    fs.readdir(p)
        .then(files => {
            files.forEach(file => {
                console.log(file)
                if (file !== '.gitignore')
                    fs.unlink(path.join(p, file))
            })
        })
}

// router.get('/api/v1/hello', (_, res) => {
//     res.json({ message: 'Hello api!'})
// })

router.post('/upload', upload.array('fonts', 32), function (req, res, next) {
    const nyttnavn = req.body.nyttnavn
    let cmd = 'python3 fontname.py ' + nyttnavn
    let toZip = []
    if (req.files.length < 1 || nyttnavn.length < 1) {
        res.status(400).send('Filer eller filnavn mangler.')
        return
    }
    req.files.forEach(file => {
        toZip.push(file)
        cmd += ' ' + file.path
    })
    fontRenamer.callFontnameScript(cmd)
        .then(oldName => {
            const newZipFile = path.join(path.resolve(), 'public', 'zips', `${nyttnavn}.zip`)
            return fontRenamer.zipFiles(toZip, newZipFile)
                .then(_ => {
                    res.json({downloadUrl: `/zips/${nyttnavn}.zip`})
                    cleanUploads()
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

export default router
