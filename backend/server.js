const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload'); // Middleware para upload de arquivos
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const assetTypeRoutes = require('./routes/assetTypeRoutes');
const brandRoutes = require('./routes/brandRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const modelRoutes = require('./routes/modelRoutes');
const userRoutes = require('./routes/userRoutes');
const steelRoutes = require('./routes/steelRoutes');
const workRoutes = require('./routes/workRoutes');
const driverRoutes = require('./routes/driverRoutes');
const gptRoutes = require('./routes/gptRoutes');
const toolRoutes = require('./routes/toolRoutes');
const serviceOrderRoutes = require('./routes/serviceOrderRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const manualRoutes = require('./routes/manualRoutes'); // Rotas de manuais

const Tool = require('./models/Tool'); // Importa o modelo Tool

const app = express();

// Conectar ao MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI não está definido no arquivo .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json()); // Middleware para processar JSON
app.use(fileUpload());   // Middleware para processar uploads de arquivos

// Método para marcar que a peça chegou (somente através do listener de e-mails)
const markPartArrived = async (toolId) => {
  try {
    const tool = await Tool.findById(toolId);
    if (!tool) {
      throw new Error('Ferramenta não encontrada');
    }

    tool.isPartArrived = true; // Marca a peça como chegada
    tool.status = 'Em estoque'; // Atualiza o status da ferramenta para "Em estoque"
    await tool.save();

    console.log(`Peça marcada como chegada para a ferramenta com ID ${toolId}`);
  } catch (error) {
    console.error('Erro ao marcar chegada da peça:', error);
  }
};

// Registrar rotas
const routes = [
  { path: '/auth', route: authRoutes },
  { path: '/assets', route: assetRoutes },
  { path: '/asset-types', route: assetTypeRoutes },
  { path: '/brands', route: brandRoutes },
  { path: '/departments', route: departmentRoutes },
  { path: '/models', route: modelRoutes },
  { path: '/users', route: userRoutes },
  { path: '/steel', route: steelRoutes },
  { path: '/works', route: workRoutes },
  { path: '/drivers', route: driverRoutes },
  { path: '/gpt', route: gptRoutes },
  { path: '/tools', route: toolRoutes },
  { path: '/service-orders', route: serviceOrderRoutes }, // Registrar a rota de OS
  { path: '/equipments', route: equipmentRoutes }, // Registrar a rota de equipamentos
  { path: '/manuals', route: manualRoutes }, // Registrar a rota de manuais
];

routes.forEach((route) => {
  app.use(route.path, route.route);
});

// Iniciar a escuta de emails
require('./emailListener')(markPartArrived); // Passar a função para o listener de e-mails

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
