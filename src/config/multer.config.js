import multer from 'multer';

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export const profileUpload = multer({ storage: profileStorage });

export async function uploadDocument(req, res) {
    profileUpload.single('document')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir documento:', err);
            return res.status(500).json({ error: 'Error interno del servidor al subir documento' });
        }

        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No se ha subido ningún archivo' });
            }

            const file = req.file;
            user.documents.push({ name: file.originalname, reference: file.path });
            user.hasUploadedDocuments = true;

            await user.save();

            res.status(200).json(user);
        } catch (error) {
            console.error('Error al subir documento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    })
}