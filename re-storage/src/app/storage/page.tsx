"use client"
import * as React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import Dialog from './editStorage';
import { SnackbarProvider } from 'notistack';

function createData(
  id: string,
  local: string,
  uso: number,
) {
  return { id, local, uso };
}

const rows = [
  createData('1', 'Al. Vicente Pinzon, 54, 3º andar 04547-130 - São Paulo/SP', 0),
  createData('2', 'Av. Paulista, 2300 Andar Pilotis 01310-300 - São Paulo/SP', 0),
  createData('3', 'R. Dr. Celestino, 122 - 611 24020-091 - Niterói/RJ', 0),
  createData('4', 'Teresina/PI', 0),
];

export default function BasicTable() {
  const [open, setOpen] = useState(false); // Estado que controla a visibilidade do Dialog

  // Função para abrir o Dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Função para fechar o Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogSubmit = (value: number, row: Object) => {
    console.log('Valor recebido no pai:', value);
    const idx = rows.findIndex(i => i == row)
    if(idx != -1) { rows[idx].uso = value }
  };

  return (
    <React.Fragment>
      <SnackbarProvider maxSnack={2}>
        <Typography variant="subtitle1" component="div">
          Gestão de armazenamento
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Estação</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Uso</TableCell>
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
                  <TableCell>{row.uso}%</TableCell>
                  <TableCell>
                    <IconButton aria-label="Editar" onClick={handleOpen}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} row={row} onSubmit={handleDialogSubmit} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SnackbarProvider>
    </React.Fragment>
  );
}
