import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from "./navbar.module.css";

const pages = [{ href: "/add", label: "Add" }];

function ResponsiveAppBar() {
  const pathName = usePathname();

  return (
    <nav>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar className={style['ocoma-nav']}>
            <Link href="/"><Typography color="white">OCoMa</Typography></Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
              {pages.map((page) => (
                <Link key={page.href} href={page.href}>
                  <Button
                    key={page.href}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    className={ pathName === page.href ? style["nav-active"] : "nav-inactive"}
                  >
                    {page.label}
                  </Button>
                </Link>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </nav>
  );
}
export const NavBar = ResponsiveAppBar ;
