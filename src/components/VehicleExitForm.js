import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../App.css';
import vehicleImage from '../assets/vehicle.png'; // Adicione o caminho correto para a imagem

const VehicleExitForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [avarias, setAvarias] = useState('');
  const [damagePoints, setDamagePoints] = useState([]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://192.168.0.78:5000/assets/available');
        const validVehicles = response.data.filter(vehicle => vehicle.nome && vehicle.modelo);
        setVehicles(validVehicles);
      } catch (error) {
        console.error('Erro ao buscar veículos disponíveis:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://192.168.0.78:5000/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Erro ao buscar motoristas:', error);
      }
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDamagePoints([...damagePoints, { x, y }]);
    drawDamagePoint(x, y);
  };

  const drawDamagePoint = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.0.78:5000/fleet/saida', {
        assetId: selectedVehicle,
        kmAtual,
        motoristaId: selectedDriver,
        avarias,
        damagePoints,
      });
      console.log('Saída registrada:', response.data);
      const updatedVehicles = vehicles.filter(vehicle => vehicle._id !== selectedVehicle);
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Erro ao registrar saída do veículo:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="vehicle-exit-form">
      <h3>Registrar Saída de Veículo</h3>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Veículo</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="select"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
          >
            <option value="">Selecione um veículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.nome} - {vehicle.modelo}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Motorista</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="select"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            required
          >
            <option value="">Selecione um motorista</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.nome}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Km Atual</Form.Label>
        <Col sm={10}>
          <Form.Control
            type="number"
            value={kmAtual}
            onChange={(e) => setKmAtual(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Avarias Descritas</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            value={avarias}
            onChange={(e) => setAvarias(e.target.value)}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Marcar Avarias</Form.Label>
        <Col sm={10}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{
              border: '1px solid black',
              background: `url(${vehicleImage}) no-repeat center/cover`
            }}
            onClick={handleCanvasClick}
          />
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrar Saída
      </Button>
    </Form>
  );
};

export default VehicleExitForm;
