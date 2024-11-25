"use client"
import * as React from 'react';
import { Box, Stack, Typography, Divider, ButtonBase } from '@mui/material';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { AutoFixHighRounded, Accessibility, EmojiObjects, ThumbUpAltRounded } from '@mui/icons-material';

const image = {
  url: '/recipes.jpg',
  title: 'Estações de armazenamento',
  width: '30%',
};

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

const items = [
  {
    icon: <EmojiObjects sx={{ color: 'text.secondary' }} />,
    title: 'Objetivo',
    description:
      "O ResStorage é um projeto forjado com o intuito de realizar gestões de estações de armazenamento de uma forma intuitiva e prática.",
  },
  {
    icon: <Accessibility sx={{ color: 'text.secondary' }} />,
    title: 'Adaptável',
    description:
      "O projeto foi construído pensando na acessibilidade, então ele contém uma responsividade completa. Permitindo liberdade de uso para o usuário.",
  },
  {
    icon: <ThumbUpAltRounded sx={{ color: 'text.secondary' }} />,
    title: 'Boa experiência do usuário',
    description:
      "Sou um profissional que atua também como UX/UI, logo a experiência do usuário é levada totalmente em conta. O projeto foi idealizado com uma interface intuitiva e fácil.",
  },
  {
    icon: <AutoFixHighRounded sx={{ color: 'text.secondary' }} />,
    title: 'Construção inteligente',
    description:
      "Pensando na fluidez e agilizade para o cliente, o ResStorage foi construído usando o Next.js 15, utilizando todos os benefícios que esse framework é capaz de trazer para otimizar o sistema com o SSR.",
  },
];

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/storage');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stack direction="row" spacing={{ xs: 3, sm: 6, md: 10 }} divider={<Divider orientation="vertical" flexItem />}>
        <Stack
          sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
        >
          {items.map((item, index) => (
            <Stack key={index} direction="row" sx={{ gap: 2 }}>
              {item.icon}
              <div>
                <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </div>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Typography variant='h5' sx={{ fontWeight: 'medium' }}>
            Conheça a parte de gestão do ResStorage clicando aqui em baixo. Espero que goste da experiência!
          </Typography>
          <ImageButton
            focusRipple
            key={image.title}
            style={{
              width: image.width,
            }}
            onClick={handleClick}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={(theme) => ({
                  position: 'relative',
                  p: 4,
                  pt: 2,
                  pb: `calc(${theme.spacing(1)} + 6px)`,
                })}
              >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        </Box>
      </Stack>
    </Box>
  );
}