import React from 'react';
import { useState } from 'react';
import { useFetch } from '../Hooks/useFetch';
import useLocalStorage from '../Hooks/useLocalStorage';
import { NewsType } from '../types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControlLabel, Switch, TextField } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://vciolac.vercel.app/">
        Victor Ciolac
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    background: {
      paper: '#FEF8D9',
      default: '#3BA4A4',
    },
    primary: {
      main: '#006064',
      contrastText: '#fff',
    },
    secondary: {
      main: '#713C1C',
      contrastText: '#000',
    },
    success: {
      main: '#39393A',
      contrastText: '#fff',
    },
    error: {
      main: '#A6271B',
      contrastText: '#000',
    },
  },
});

const Home = () => {
  const { news, loading, error } = useFetch();
  const { localStorageValue, updateValue } = useLocalStorage<number[]>('favorites', []);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  if (loading) return (<div>Carregando...</div>);

  if (error) return (<div>{error}</div>);

  const itemsPerPage = 9;

  const getNineNews = () => {
    if (resetSearch) {
      return news
        .filter((item) => selectedType ? item.tipo === selectedType : true)
        .slice(0, itemsPerPage);
    }
    const finalNews = searchClicked ? filteredNews : news;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return finalNews
      .filter((item) => selectedType ? item.tipo === selectedType : true)
      .slice(start, end);
  };


  const showOnlyFavorites = () => {
    const favorites: number[] = localStorageValue;
    const favoritesNews = news.filter((item) => favorites.includes(item.id));
    return favoritesNews;
  };

  const theNews = showFavorites ? showOnlyFavorites() : getNineNews();

  const HandleClick = (link: string) => {
    window.open(link, '_blank');
  };

  const HandleFavorite = (id: number) => {
    const favorites: number[] = localStorageValue;
    const isFavorite = favorites.includes(id);
    if (isFavorite) {
      const newFavorites = favorites.filter((item) => item !== id);
      updateValue(newFavorites);
    } else {
      const newFavorites = [...favorites, id];
      updateValue(newFavorites);
    }
  };

  const isFavorite = (id: number) => {
    return localStorageValue.includes(id);
  };

  const handleFilter = () => {
    setShowFavorites(!showFavorites);
  };

  const calculateDate = (dateString: string) => {
    const dateParts = dateString.split(/[\s/:\\-]+/);
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[0]);
    const hour = parseInt(dateParts[3]);
    const minute = parseInt(dateParts[4]);
    const second = parseInt(dateParts[5]);
    const date = new Date(year, month, day, hour, minute, second);
    const today = new Date();
    const difference = today.getTime() - date.getTime();
    const days = Math.floor(difference / (1000 * 3600 * 24));
    if (days === 0) {
      return 'Hoje';
    }
    if (days === 1) {
      return 'Ontem';
    }
    return `${days} dias atrás`;
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleFilter(event.target.value);
  };

  const handleSearch = () => {
    const filteredNews = news.filter((item) => {
      const matchesTitle = titleFilter ? item.titulo.toLowerCase().includes(titleFilter.toLowerCase()) : true;
      const matchesType = selectedType ? item.tipo === selectedType : true;
      return matchesTitle && matchesType;
    });

    setFilteredNews(filteredNews);
    setSearchClicked(true);
    setResetSearch(false);
  };

  const handleFilterByType = (type: string | null) => {
    if (type === selectedType) {
      setSelectedType(null);
      return;
    }
    setSelectedType(type);
  };

  const handleResetFilters = () => {
    setResetSearch(true);
    handleFilterByType(null)
    setTitleFilter('');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Termo News
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Bem-vindo!
              Aqui você encontrará informações atualizadas diretamente do Instituto Brasileiro de Geografia e Estatística (IBGE).
              Explore artigos e análises baseados em dados confiáveis para ficar por dentro das histórias que moldam nosso mundo.
            </Typography>
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
            >
              <Button sx={{ paddingX: 8 }} size="small" color="error" onClick={handleFilter} variant="outlined">{showFavorites ? 'Mostrar todas' : 'Mostrar favoritos'}</Button>
              <TextField onChange={handleTitleFilterChange} value={titleFilter} type="search" id="outlined-search" label="Filtrar por título" variant="outlined" />
              <Button color="success" onClick={handleSearch} endIcon={<SendIcon />} variant="outlined">Pesquisar</Button>
              <Button onClick={handleResetFilters} endIcon={<DeleteIcon />} variant="outlined">Limpar</Button>
            </Stack>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={1}
              justifyContent="center">
              <FormControlLabel onClick={() => handleFilterByType("Notícia")} control={<Switch checked={selectedType === "Notícia"}/>} label="Notícias" />
              <FormControlLabel onClick={() => handleFilterByType("Release")} control={<Switch checked={selectedType === "Release"}/>} label="Releases" />
            </Stack>
          </Container>
        </Box>
        <Container sx={{ paddingTop: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {theNews.map((news) => (
              <Grid item key={news.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {news.titulo}
                    </Typography>
                    {news.tipo}
                    <Typography>
                      {news.introducao}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Stack
                      direction="row" >
                      <Button color='success' variant='outlined' onClick={() => HandleClick(news.link)} size="small">Ler mais</Button>
                      <Button color='error' variant='outlined' onClick={() => HandleFavorite(news.id)} size="small">{isFavorite(news.id) ? 'Desfavoritar' : 'Favoritar'}</Button>
                    </Stack>
                  </CardActions>
                  <Stack
                    direction="column"
                    spacing={1}
                    alignItems='center'
                  >
                    <Typography gutterBottom variant="subtitle1" component="h6">
                      {calculateDate(news.data_publicacao)}
                    </Typography>
                    <Typography gutterBottom variant="caption" component="span">
                      {news.data_publicacao}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Stack
        sx={{ pt: 4, marginBottom: 4 }}
        direction="row"
        spacing={1}
        justifyContent="center">
        {!showFavorites && currentPage > 1 && (
          <Button color="secondary" variant="outlined" type="button" size="small" onClick={handlePrevPage}>Página Anterior</Button>
        )}
        {!showFavorites && theNews.length >= 9 && (
          <Button color="secondary" variant="outlined" type="button" size="small" onClick={handleNextPage}>Próxima Página</Button>
        )}
      </Stack>
      <Box sx={{ bgcolor: 'background.paper', py: 0.1 }} component="footer">
        <Copyright />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
