import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import toast from 'react-hot-toast';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Container, Box, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import Dataactions from './DataactionsAdmin';
import { getUsers } from '../../Services/adminservice'; // Importa el servicio

export default function DashboardAdmin() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [data, setData] = useState([]); // Inicializa como arreglo vacío
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  // Llamada al servicio para obtener usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setData(users); // Actualiza el estado con los usuarios obtenidos
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => openModal(params.id)}>
          <EditIcon sx={{ color: '#005074' }} />
        </IconButton>
      ),
      sortable: false,
      align: 'center',
      headerAlign: 'center',
    },
    { field: 'firstName', headerName: 'Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'ssn', headerName: 'SSN', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
  ];

  const openModal = (id = null) => {
    const record = data.find((item) => item._id === id) || { name: '', role: '' };
    setFormData(record);
    setEditingIndex(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (editingIndex !== null) {
      const updatedData = data.map((item) =>
        item._id === editingIndex ? { ...item, ...formData } : item
      );
      setData(updatedData);
      toast.success('Record updated');
    } 
    
    /*else {
      const newRecord = { id: data.length + 1, ...formData };
      setData([...data, newRecord]);
      toast.success('New record created');
    }*/
    closeModal();
  };

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, display: 'flex', flexDirection: 'column' }}>
        {/* Tabla */}
        <Box sx={{ flex: 1, maxHeight: '90%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight={false}
            sx={{
              minWidth: '1000px',
              width: '100%',
              '& .MuiDataGrid-cell': {
                backgroundColor: 'white', // Fondo blanco para las celdas
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'white', // Fondo blanco para las cabeceras
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'white', // Fondo blanco para el pie de página
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: 'white', // Fondo blanco para todo el área de scroll virtual
              },
            }}
            getRowId={(row) => row._id}
          />
        </Box>
      </Container>

      {/* Modal para Crear/Editar */}
      <Dataactions
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        formData={formData}
        handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        editing={editingIndex !== null}
      />
    </div>
  );
}
