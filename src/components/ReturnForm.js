import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReturnForm = ({ refreshTools }) => {
  const [description, setDescription] = useState('');
  const [toolId, setToolId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedWork, setSelectedWork] = useState('');
  const [responsible, setResponsible] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [defective, setDefective] = useState(false);
  const [internalUse, setInternalUse] = useState(false);
  const [works, setWorks] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/works`);
        setWorks(response.data);
      } catch (error) {
        console.error("Erro ao buscar as obras", error);
      }
    };

    const fetchWithdrawnTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools/withdrawn`);
        setTools(response.data);
      } catch (error) {
        console.error("Erro ao buscar as ferramentas retiradas", error);
      }
    };

    fetchWorks();
    fetchWithdrawnTools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${toolId}/status`, {
        status: defective ? 'Em manutenção' : 'Em estoque',
        problemDescription: defective ? 'Defeito identificado' : '',
        solutionDescription: defective ? '' : '',
      });

      setDescription('');
      setToolId('');
      setSerialNumber('');
      setSelectedWork('');
      setResponsible('');
      setReturnDate('');
      setDefective(false);
      setInternalUse(false);
      refreshTools();
      alert('Ferramenta devolvida com sucesso!');
    } catch (error) {
      console.error('Erro ao devolver a ferramenta', error);
      alert('Erro ao devolver a ferramenta.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 return-form">
      <h2 className="mb-4">Devolução</h2>
      <div className="form-group mb-3">
        <label>Ferramenta:</label>
        <select
          className="form-control"
          value={toolId}
          onChange={(e) => {
            const selectedTool = tools.find(tool => tool._id === e.target.value);
            if (selectedTool) {
              setToolId(selectedTool._id);
              setDescription(selectedTool.description);
              setSerialNumber(selectedTool.serialNumber);
            }
          }}
          required
        >
          <option value="">Selecione uma ferramenta</option>
          {tools.map(tool => (
            <option key={tool._id} value={tool._id}>{tool.toolName} - {tool.serialNumber}</option>
          ))}
        </select>
      </div>
      <div className="form-group mb-3">
        <label>Descrição:</label>
        <input
          type="text"
          className="form-control"
          value={description}
          readOnly
        />
      </div>
      <div className="form-group mb-3">
        <label>Número de Série:</label>
        <input
          type="text"
          className="form-control"
          value={serialNumber}
          readOnly
        />
      </div>
      <div className="form-group mb-3">
        <label>Responsável pela Devolução:</label>
        <input
          type="text"
          className="form-control"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Data de Retorno:</label>
        <input
          type="date"
          className="form-control"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="defectiveCheck"
          checked={defective}
          onChange={(e) => setDefective(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="defectiveCheck">Devolvido com Defeito</label>
      </div>
      <div className="form-group form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="internalUseCheck"
          checked={internalUse}
          onChange={(e) => setInternalUse(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="internalUseCheck">Uso Interno</label>
      </div>
      <div className="form-group mb-3">
        <label>Obra:</label>
        <select
          className="form-control"
          value={selectedWork}
          onChange={(e) => setSelectedWork(e.target.value)}
          disabled={internalUse}
          required={!internalUse}
        >
          <option value="">Selecione uma obra</option>
          {works.map(work => (
            <option key={work._id} value={work._id}>{work.client} - {work.workAddress}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Devolver</button>
    </form>
  );
};

export default ReturnForm;
