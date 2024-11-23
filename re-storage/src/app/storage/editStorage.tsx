"use client";
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from "notistack";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: number, row: Object) => void; // Função para enviar o valor ao componente pai
  row: {
    id: string,
    local: string
    uso: number,
  };
}

export default function EditStorage({ open, onClose, row, onSubmit }: MyDialogProps) {
  const [value, setValue] = useState<string>(row.uso.toString()); // Estado inicial como string para aceitar vazio

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Permitir apenas valores numéricos ou vazio
    if (inputValue === '' || !isNaN(Number(inputValue))) {
      setValue(inputValue);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value === '' || isNaN(Number(value))) {
      enqueueSnackbar('O valor deve ser numérico', { variant: 'error' });
      return;
    }

    const numericValue = Number(value);
    if (numericValue > 100) {
      enqueueSnackbar('O valor deve ser menor ou igual a 100', { variant: 'error' });
      return;
    }

    enqueueSnackbar('Valor salvo com sucesso!', { variant: 'success' });
    onSubmit(numericValue, row);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Editar armazenamento</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Porcentagem de utilização"
          type="number"
          fullWidth
          variant="standard"
          value={value}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}