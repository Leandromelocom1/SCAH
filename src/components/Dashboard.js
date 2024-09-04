import React, { useEffect, useState } from 'react';
import axios from '../setupAxios';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  YAxis as RechartsYAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [dataFerramentas, setDataFerramentas] = useState([]);
  const [dataEntradas, setDataEntradas] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools`);
        processToolData(response.data);
      } catch (error) {
        console.error('Erro ao buscar as ferramentas:', error);
      }
    };
    fetchTools();
  }, []);

  const processToolData = (tools) => {
    if (!tools || tools.length === 0) {
      console.warn('Nenhuma ferramenta encontrada.');
      return;
    }

    const statusCounts = tools.reduce((acc, tool) => {
      acc[tool.status] = (acc[tool.status] || 0) + 1;
      return acc;
    }, {});

    const entradasSaidas = tools.reduce((acc, tool) => {
      const date = new Date(tool.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[date]) {
        acc[date] = { entradas: 0, saídas: 0 };
      }
      acc[date].entradas += 1;
      if (tool.status === 'Retirada') {
        acc[date].saídas += 1;
      }
      return acc;
    }, {});

    setDataFerramentas([
      { name: 'Em Estoque', value: statusCounts['Em estoque'] || 0 },
      { name: 'Retirada', value: statusCounts['Retirada'] || 0 },
      { name: 'Em Manutenção', value: statusCounts['Em manutenção'] || 0 },
      { name: 'Reparado', value: statusCounts['Reparado'] || 0 },
    ]);

    setDataEntradas(
      Object.keys(entradasSaidas).map((key) => ({
        name: key,
        entradas: entradasSaidas[key].entradas,
        saídas: entradasSaidas[key].saídas,
      }))
    );
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <h2>DASHBOARD</h2>

      <div className="chart-container">
        <h3>Status das Ferramentas</h3>
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie
              data={dataFerramentas}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {dataFerramentas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Movimentação de Ferramentas</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dataEntradas}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <RechartsYAxis yAxisId="left" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="entradas"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line yAxisId="left" type="monotone" dataKey="saídas" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
