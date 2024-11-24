"use client";
import * as React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Chip, Stack, Tooltip } from '@mui/material';
import { Edit, Inventory, LocalShipping } from '@mui/icons-material';
import Dialog from './editStorage';
import AlertDialog from '../components/alertDialog';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

function createData(
  id: string,
  local: string,
  usage: number,
  status: string | null,
) {
  return { id, local, usage, status };
}

// Mockando os dados
const initialRows = [
  createData('1', 'Al. Vicente Pinzon, 54, 3º andar 04547-130 - São Paulo/SP', 0, 'Vazio'),
  createData('2', 'Av. Paulista, 2300 Andar Pilotis 01310-300 - São Paulo/SP', 0, 'Vazio'),
  createData('3', 'R. Dr. Celestino, 122 - 611 24020-091 - Niterói/RJ', 0, 'Vazio'),
  createData('4', 'Teresina/PI', 0, 'Vazio'),
];

export default function BasicTable() {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null); // Linha em que está sendo confirmada a coleta
  const [editingRow, setEditingRow] = useState<typeof rows[0] | null>(null); // Linha que está sendo editada

  const handleOpen = (row: typeof rows[0]) => {
    setEditingRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
  };

  const handleOpenAlert = (id: string) => {
    setConfirmId(id);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setConfirmId(null);
    setOpenAlert(false);
  };

  // Função para tratar o aceite de uma solicitação de coleta
  const handleConfirm = (id: string | null) => {
    let status = 'Vazio', value = 0;
    enqueueSnackbar('Coleta aceita!', { variant: 'success' });

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, usage: value, status: status } : row
      )
    );
    handleCloseAlert();
  };

  const handleRequest = (id: string) => {
    let status = 'Aguardando coleta';
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, status: status } : row
      )
    );
    enqueueSnackbar('Pedido de coleta criado!', { variant: 'success' });
  }

  // Função para lidar com a submissão do Dialog e atualizar as informações da linha
  const handleDialogSubmit = (value: number) => {
    if (editingRow) {
      let status = null;
      if (value >= 80) {
        handleRequest(editingRow.id)
      } else if (value > 0 && value < 80) {
        status = 'Em uso';
      } else if (value <= 0) {
        status = 'Vazio';
        value = 0;
      }      

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingRow.id ? { ...row, usage: value, ...(value < 80 && { status: status }) } : row
        )
      );
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <SnackbarProvider maxSnack={2}>
        <Stack spacing={3}>  
          <Typography variant="h4" component="div">
            Gestão de armazenamento
          </Typography>
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
                {rows.map((row) => (
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
                              onClick={() => handleRequest(row.id)} // Solicitação de coleta manualmente
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
        </Stack>
      </SnackbarProvider>
    </React.Fragment>
  );
}