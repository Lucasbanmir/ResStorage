"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Chip, Stack, Tooltip, CircularProgress } from '@mui/material';
import { Edit, Inventory, LocalShipping } from '@mui/icons-material';
import Dialog from './editStorage';
import AlertDialog from '../components/alertDialog';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

interface storage {
  id: string,
  local: string,
  usage: number,
  status: string | null,
};

function useDialog(createRequest: (id: string) => void, setData: (id: string, attribute: string, value: any) => void) {
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<storage | null>(null); // Linha que está sendo editada

  const handleOpen = (row: storage) => {
    setEditingRow(row);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
  };

  // Função para lidar com a submissão do Dialog e atualizar as informações da linha
  const handleDialogSubmit = (value: number) => {
    if (!editingRow) return;
  
    const status = value >= 80 
      ? (createRequest(editingRow.id), null) 
      : value > 0 && value < 80
        ? 'Em uso'
        : 'Vazio';
  
    setData(editingRow.id, 'usage', Math.max(0, value));
    if (value < 80) setData(editingRow.id, 'status', status);
    handleClose();
  };

  return { open, editingRow, handleOpen, handleClose, handleDialogSubmit };
}

function useAlertDialog(setData: (id: string, attribute: string, value: any) => void) {
  const [openAlert, setOpenAlert] = useState(false);
  const [confirmId, setConfirmId] = useState<string>(''); // Linha em que está sendo confirmada a coleta

  const handleOpenAlert = (id: string) => {
    setConfirmId(id);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setConfirmId('');
    setOpenAlert(false);
  };

  // Função para tratar o aceite de uma solicitação de coleta
  const handleConfirm = (id: string) => {
    handleCloseAlert();
    setData(id, 'usage', 0);
    setData(id, 'status', 'Vazio');
    enqueueSnackbar('Coleta aceita!', { variant: 'success' });
  };

  return { openAlert, confirmId, handleOpenAlert, handleCloseAlert, handleConfirm };
}

export default function BasicTable() {
  const [rows, setRows] = useState<storage[]>([]);

  const { open, editingRow, handleOpen, handleClose, handleDialogSubmit } = useDialog(createRequest, setData);
  
  const { openAlert, confirmId, handleOpenAlert, handleCloseAlert, handleConfirm } = useAlertDialog(setData);

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await axios.get('/api/storage'),
    queryKey: ["rows"],
  });

  // Sincronizar os dados do React Query com o estado local para permitir manipulações
  useEffect(() => {
    if (data?.data && rows.length === 0) {
      setRows(data.data);
    }
  }, [data]);

  function setData(id: string, attribute: string, value: any ) {
    setRows((prevRows) => (prevRows || []).map((row) =>
      row.id === id ? { ...row, [attribute]: value } : row
    ));
  };

  function createRequest(id: string) {
    setData(id, 'status', 'Aguardando coleta');
    enqueueSnackbar('Pedido de coleta criado!', { variant: 'success' });
  };

  if (isLoading)
    return (
      <Stack alignItems="center" justifyContent="center" height="200px">
        <CircularProgress />
      </Stack>
    );

  return (
    <Stack spacing={3}>  
      <Typography variant="h4" component="div">
        Gestão de armazenamento
      </Typography>
      {isError ? (
        <Typography variant="subtitle1" color="error">
          Ocorreu um erro ao carregar os dados.
        </Typography>
      ) : rows.length === 0 ? (
        <Typography variant="subtitle1">
          Nenhum resultado encontrado.
        </Typography>
      ) : (
        <React.Fragment>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Estação</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Uso</TableCell>
                  <TableCell>Situação</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: storage) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.local}</TableCell>
                    <TableCell sx={{
                      // Melhorar a exibição de quando uma estação de armazenamento está maior ou igual que 80
                      color: row.usage >= 80 ? 'red' : 'inherit',
                      fontWeight: row.usage >= 80 ? 'bold' : 'normal',
                    }}>{row.usage}%</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={row.usage >= 80 ? "warning" : "primary"} variant={ row.usage === 0 ? 'outlined' : 'filled'} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Confirmar coleta" placement="top">
                          <span>
                            <IconButton
                              disabled={row.status !==  "Aguardando coleta"}
                              color="success"
                              aria-label="Confirmar coleta"
                              onClick={() => handleOpenAlert(row.id)}
                            >
                              <Inventory fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Editar" placement="top">
                          <IconButton
                            aria-label="Editar"
                            onClick={() => handleOpen(row)} // Atualiza o valor do uso da estação
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Solicitar coleta" placement="top">
                          <span>
                            <IconButton
                              disabled={row.status ===  "Aguardando coleta" || row.usage <= 0}
                              color="primary"
                              aria-label="Solicitar coleta"
                              onClick={() => createRequest(row.id)} // Solicitação de coleta manualmente
                            >
                              <LocalShipping fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {editingRow && (
            <Dialog
              open={open}
              onClose={handleClose}
              usage={editingRow.usage} // Passar o valor atual de uso para que o dialog identifique o último valor de uso da estação
              onSubmit={handleDialogSubmit} // Função para salvar
            />
          )}
          <AlertDialog
            open={openAlert}
            onClose={handleCloseAlert}
            text="Você está prestes a confirmar a coleta desta estação. Essa ação não pode ser desfeita."
            onSubmit={() => handleConfirm(confirmId)}
          />
        </React.Fragment>
    )}
    </Stack>
  );
}