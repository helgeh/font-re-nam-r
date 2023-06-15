
import express from 'express'
import path from 'path'
import { promises as fs, createReadStream, createWriteStream } from 'fs'

import { exec } from 'child-process-promise'
import archiver from 'archiver'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })


function callFontnameScript(cmd) {
    // return Promise.resolve()
    return exec(cmd)
        .then(function (result) {
                var stdout = result.stdout;
                var stderr = result.stderr;
                console.log('NOE GIKK FEIL!', stderr)
                // if (stderr)
            })
        // .catch(function (err) {
        //         console.error('ERROR: ', err)
        //     })
}

function zipFiles(files, outPath) {
    // return Promise.resolve()
    const archive = archiver('zip', { zlib: { level: 9 }})
    const stream = createWriteStream(outPath)
  
    return new Promise((resolve, reject) => {
        archive
            .on('error', err => reject(err))
            .pipe(stream)
  
        for (var i = 0; i < files.length; i++) {
            const file1 = path.join(path.resolve(), files[i].path)
            archive.append(createReadStream(file1), { name: files[i].originalname })
        }

        stream.on('close', () => resolve())
        archive.finalize()
    })
}
  
const router = express.Router()

router.get('/api/v1/hello', (_, res) => {
    res.json({ message: 'Hello api!'})
})

router.post('/upload', upload.array('fonts', 32), function (req, res, next) {
    const nyttnavn = req.body.nyttnavn
    let cmd = 'python3 fontname.py ' + nyttnavn
    let toZip = []
    if (req.files.length < 1 || nyttnavn.length < 1)
        res.end('No files or new name provided')
    req.files.forEach(file => {
        toZip.push(file)
        cmd += ' ' + file.path
    })
    const stdout = callFontnameScript(cmd)
        .then(_ => {
            const newZipFile = path.join(path.resolve(), 'public', 'zips', nyttnavn + '.zip');
            return zipFiles(toZip, newZipFile)
                .then(_ => res.download(newZipFile))
        })
        .catch(err => {
            res.err('Something went wrong converting the font names', err)
        })
    // TODO cleanup the uploads!
})

export default router
