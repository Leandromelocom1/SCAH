const path = require('path');
const fs = require('fs');

const uploadManual = (req, res) => {
  try {
    console.log('Iniciando upload do manual...'); // Log para iniciar o processo
    console.log('Arquivos recebidos:', req.files); // Log para ver os arquivos recebidos

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const manual = req.files.manual;
    const uploadDir = path.join(__dirname, '..', 'uploads');

    // Verifique se o diretório de upload existe, caso contrário, crie-o
    if (!fs.existsSync(uploadDir)) {
      console.log('Diretório de upload não existe, criando...'); // Log de criação de diretório
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, manual.name);

    manual.mv(uploadPath, (err) => {
      if (err) {
        console.error('Erro ao mover o arquivo:', err);
        return res.status(500).send('Erro ao salvar o arquivo.');
      }
      res.send('File uploaded!');
    });
  } catch (error) {
    console.error('Erro no upload do manual:', error);
    res.status(500).send('Erro interno no servidor.');
  }
};

module.exports = {
  uploadManual,
};
