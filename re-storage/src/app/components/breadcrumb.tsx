"use client"
import React from 'react';
import { useRouter } from 'next/router';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function DynamicBreadcrumbs() {
  const router = useRouter();
  const pathnames = router.pathname.split('/').filter((x) => x); // Divide a URL em partes

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>
      {pathnames.map((segment, index) => {
        // Para cada parte da URL, gera um link
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <Link
            key={routeTo}
            underline="hover"
            color={index === pathnames.length - 1 ? 'inherit' : 'text.primary'}
            aria-current={index === pathnames.length - 1 ? 'page' : undefined}
            href={routeTo}
          >
            {segment}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default DynamicBreadcrumbs;