const express = require('express');
const router = express.Router();
const {
  getTools,
  createTool,
  getAvailableTools,
  getWithdrawnTools,
  getDefectiveTools,
  updateToolStatus,
  repairTool,
  sendPurchaseRequest,
  markPartArrived // Importe a nova função
} = require('../controllers/toolController');

router.get('/', getTools);
router.get('/available', getAvailableTools);
router.get('/withdrawn', getWithdrawnTools);
router.get('/defective', getDefectiveTools); 
router.post('/', createTool);
router.patch('/:id/status', updateToolStatus);
router.patch('/:id/repair', repairTool); 
router.post('/send-purchase-request', sendPurchaseRequest); 
router.patch('/:id/part-arrived', markPartArrived); // Nova rota para marcar a chegada da peça

module.exports = router;
