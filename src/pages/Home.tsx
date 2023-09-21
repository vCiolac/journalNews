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
import { AppBar, CardMedia, FormControlLabel, Switch, TextField, Toolbar } from '@mui/material';
import Loading from '../component/Loading';

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

  if (loading) return (<Loading />);

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

    const filteredFavoritesNews = favoritesNews.filter((item) =>
      selectedType ? item.tipo === selectedType : true
    );

    if (searchClicked) {
      const filteredFavoritesWithTitle = filteredFavoritesNews.filter((item) =>
        titleFilter ? item.titulo.toLowerCase().includes(titleFilter.toLowerCase()) : true
      );
      return filteredFavoritesWithTitle;
    } else {
      return filteredFavoritesNews;
    }
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
    setSearchClicked(false);
  };

  const handleImg = (img: string) => {
    const imagesData = JSON.parse(img);
    const introImageURL = imagesData.image_intro;
    return `https://agenciadenoticias.ibge.gov.br/${introImageURL}`;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar sx={{ paddingX: 3, my: 1, alignItems: 'center', justifyContent: 'center'}}>
        <svg width="349.15000000000003" height="84.34929154072461" viewBox="0 0 370 77.7228940667218">
          <g id="SvgjsG1206" transform="matrix(0.8635685319822507,0,0,0.8635685319822507,-8.17885814619234,-4.3169791539700695)" fill="#111111"><path xmlns="http://www.w3.org/2000/svg" d="M88.838,51.396c-2.26-2.258-5.92-2.256-8.18,0l-2.725,2.725l8.178,8.178l2.727-2.725  C91.092,57.315,91.096,53.655,88.838,51.396z"></path>
          <polygon xmlns="http://www.w3.org/2000/svg" points="47.955,84.101 45.232,95.001 56.133,92.276 83.389,65.022 75.207,56.845 "></polygon><path xmlns="http://www.w3.org/2000/svg" d="M68.375,55.489V9.208c0-2.324-1.881-4.209-4.207-4.209H13.68c-2.322,0-4.209,1.885-4.209,4.209v58.906  c0,2.324,1.887,4.205,4.209,4.205h37.865L68.375,55.489z M51.545,66.37V55.489h10.881L51.545,66.37z M47.338,55.489v12.625H13.68  V9.208h50.488v42.074H51.545C49.219,51.282,47.338,53.169,47.338,55.489z"></path>
          <rect xmlns="http://www.w3.org/2000/svg" x="39.816" y="22.673" width="19.67" height="14.305"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="13.509" width="41.127" height="4.916"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="22.673" width="17.988" height="2.766"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="40.085" width="41.127" height="2.766"></rect>
          <rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="34.28" width="17.988" height="2.766"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="28.476" width="17.988" height="2.766"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="45.89" width="41.127" height="2.766"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="51.694" width="25.141" height="2.766"></rect><rect xmlns="http://www.w3.org/2000/svg" x="18.359" y="57.497" width="25.141" height="2.766"></rect>
          </g><g id="SvgjsG1207" transform="matrix(0.7338239708333637,0,0,0.7338239708333637,86.38811916577495,24.968521753246986)" fill="#111111"><path d="M23.281 7.5 l11.797 0 l0 -6.0938 l-30.156 0 l0 6.0938 l18.359 0 z M16.719 13.594000000000001 l6.5625 0 l0 25 l-6.5625 0 l0 -25 z M46.0938 1.4059999999999988 l27.813 0 l0 5.9375 l-27.813 0 l0 -5.9375 z M46.0938 32.6562 l27.734 0 l0 5.9375 l-27.734 0 l0 -5.9375 z M46.0938 16.875 l25.078 0 l0 5.8594 l-25.078 0 l0 -5.8594 z M115.781 38.5937 l-10.078 -14.063 c1.3541 -0.41664 2.552 -0.91141 3.5937 -1.4843 c1.1459 -0.72914 2.0834 -1.5364 2.8125 -2.4218 c0.83336 -0.98961 1.4323 -2.0573 1.797 -3.2032 c0.46875 -1.25 0.70313 -2.6563 0.70313 -4.2188 c0 -1.8229 -0.3125 -3.4635 -0.9375 -4.9219 c-0.625 -1.4063 -1.5365 -2.6302 -2.7344 -3.6719 c-1.1459 -0.98961 -2.6042 -1.7709 -4.3751 -2.3438 c-1.8229 -0.57289 -3.75 -0.85938 -5.7813 -0.85938 l-16.563 0 l0 5.9375 l16.016 0 c2.4479 0 4.3489 0.52086 5.703 1.5625 s2.0313 2.6041 2.0313 4.6875 c0 1.9271 -0.67711 3.4375 -2.0313 4.5313 c-1.3541 1.1459 -3.2291 1.7188 -5.625 1.7188 l-16.094 0 l0 18.75 l6.4844 0 l0 -12.969 l8.2031 0 l9.1406 12.969 l7.7344 0 l0 0 z M151.953 38.5937 l6.5625 0 l0 -27.422 l-6.5625 9.6094 l0 17.813 z M158.516 1.4059999999999988 l-7.0313 0 l-11.484 17.813 l-11.406 -17.813 l-7.0313 0 l0 37.188 l6.5625 0 l0 -26.406 l11.719 17.578 l0.23438 0 l10.234 -15.156 c0.052109 -0.20836 2.7865 -4.6094 8.2031 -13.203 z M177.344 32.6562 c-0.78125 -0.15625 -1.5105 -0.3907 -2.1876 -0.7032 c-1.4584 -0.67711 -2.7344 -1.6146 -3.8281 -2.8125 c-1.0416 -1.0938 -1.875 -2.4479 -2.5 -4.0625 c-0.57289 -1.6146 -0.85938 -3.2552 -0.85938 -4.9219 l0 -0.15625 l0 -0.23438 c0 -1.7188 0.28648 -3.3854 0.85938 -5 c0.67711 -1.6666 1.5105 -2.9948 2.5001 -3.9844 c1.0416 -1.1979 2.2916 -2.1094 3.75 -2.7344 c0.88539 -0.41664 1.6406 -0.67703 2.2656 -0.78117 l0 -5.8594 c-1.8229 0.26039 -3.4375 0.70313 -4.8438 1.3281 c-2.2916 0.98961 -4.2448 2.3177 -5.8594 3.9844 s-2.8906 3.6458 -3.8281 5.9374 s-1.4063 4.6875 -1.4063 7.1875 l0 0.15625 l0 0.23438 c0 2.5521 0.46875 4.948 1.4063 7.1876 c0.83336 2.2396 2.0834 4.1927 3.75 5.8594 c1.6666 1.7188 3.6198 3.0469 5.8594 3.9844 c1.4063 0.625 3.0469 1.0677 4.9219 1.3281 l0 -5.9375 z M198.594 20 l0.000076294 -0.23438 c0 -2.5521 -0.46875 -4.948 -1.4063 -7.1876 c-0.9375 -2.2916 -2.2135 -4.2708 -3.8281 -5.9374 c-1.5625 -1.6666 -3.4896 -2.9688 -5.7813 -3.9063 c-1.3021 -0.625 -2.8906 -1.0677 -4.7656 -1.3281 l0 5.9375 l0.9375 0.3125 c0.46875 0.15625 0.83336 0.28648 1.0938 0.39063 c1.4584 0.67711 2.7344 1.6146 3.8281 2.8125 c1.0416 1.0938 1.875 2.4479 2.5 4.0625 c0.57289 1.6146 0.85938 3.2552 0.85938 4.9219 l0 0.15625 l0 0.23438 c0 1.7188 -0.28648 3.3854 -0.85938 5 c-0.67711 1.6666 -1.5105 2.9948 -2.5001 3.9844 c-1.0416 1.1979 -2.2916 2.1094 -3.75 2.7344 c-0.67711 0.3125 -1.3802 0.54688 -2.1094 0.70313 l0 5.9375 c1.5625 -0.20836 3.125 -0.65109 4.6875 -1.3282 c2.1354 -0.88539 4.0885 -2.2135 5.8594 -3.9844 c1.7188 -1.8229 2.9948 -3.802 3.8281 -5.9374 c0.9375 -2.2916 1.4063 -4.6875 1.4063 -7.1875 l0 -0.15625 z  M235.54685 38.5937 l6.4844 0 l0 -19.922 l-6.4844 -9.1406 l0 29.063 z M261.48475 1.4059999999999988 l0 25.703 l-18.359 -25.703 l-7.0313 0 l26.406 37.188 l5.3906 0 l0 -37.188 l-6.4063 0 z M277.81255 1.4059999999999988 l27.813 0 l0 5.9375 l-27.813 0 l0 -5.9375 z M277.81255 32.6562 l27.734 0 l0 5.9375 l-27.734 0 l0 -5.9375 z M277.81255 16.875 l25.078 0 l0 5.8594 l-25.078 0 l0 -5.8594 z M319.21875 1.4059999999999988 l-6.0156 0 l7.5781 37.188 l6.5625 0 l-4.8438 -22.891 z M344.53175 1.4059999999999988 l-4.375 15.547 l2.9688 11.328 l7.1875 -26.875 l-5.7813 0 z M335.07775 12.812000000000001 l-0.46875 -1.9531 l-2.5 -9.4531 l-3.3594 11.094 l-0.15625 0.3125 l-1.25 4.375 l2.3438 10.469 l1.4844 -5.1563 l3.8281 16.094 l6.6406 0 l-5.7813 -22.891 z M376.64075 1.4059999999999988 c-2.8646 0 -5.5209 0.4686 -7.9688 1.4061 c-2.3959 0.9375 -4.4792 2.2396 -6.2501 3.9063 c-1.7188 1.5625 -3.0729 3.5416 -4.0625 5.9375 c-0.83336 2.0313 -1.3021 4.2448 -1.4063 6.6406 l0 2.3438 l6.875 0 l0 -2.3438 c0.10414 -1.7709 0.39063 -3.2031 0.85938 -4.2969 c0.625 -1.5104 1.4844 -2.8645 2.5781 -4.0624 c1.3021 -1.1979 2.6563 -2.0833 4.0625 -2.6562 c1.6146 -0.625 3.3855 -0.9375 5.3126 -0.9375 l9.8438 0 l0 -5.9375 l-9.8438 0 z M379.60975 18.984 l0.000076294 1.4843 l0.078125 0 c-0.10414 1.6666 -0.41664 3.2031 -0.9375 4.6094 c-0.67711 1.6146 -1.5365 2.9427 -2.5781 3.9844 c-1.1459 1.1459 -2.5 2.0313 -4.0625 2.6563 c-1.6146 0.625 -3.3855 0.9375 -5.3126 0.9375 l-9.8438 0 l0 5.9375 l9.8438 0 c2.8646 0 5.5209 -0.46875 7.9688 -1.4063 c2.3959 -0.9375 4.4792 -2.2396 6.2501 -3.9063 c1.8229 -1.8229 3.177 -3.802 4.0624 -5.9374 c0.9375 -2.0834 1.4063 -4.375 1.4063 -6.875 l0 -1.4844 l-6.875 0 z"></path></g></svg>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 2,
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
              Bem-vindo!
              Aqui você encontrará informações atualizadas diretamente do Instituto Brasileiro de Geografia e Estatística (IBGE).
              Explore artigos e análises baseados em dados confiáveis para ficar por dentro das histórias que moldam nosso mundo.
            </Typography>
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
            >
              <TextField onChange={handleTitleFilterChange} value={titleFilter} type="search" id="outlined-search" label="Filtrar por título" variant="outlined" />
              <Button color="success" onClick={handleSearch} endIcon={<SendIcon />} variant="outlined">Pesquisar</Button>
              <Button onClick={handleResetFilters} endIcon={<DeleteIcon />} variant="outlined">Limpar</Button>
            </Stack>
            <Stack
              sx={{ pt: 4, alignItems: 'center', flexWrap: 'wrap', flexGrow: 1 }}
              direction="row"
              spacing={1}
              justifyContent="center">
              <FormControlLabel sx={{ color: 'error.main' }} onClick={handleFilter} control={<Switch checked={showFavorites} />} label="Favoritas"/>
              <FormControlLabel sx={{ color: 'primary.main' }} onClick={() => handleFilterByType("Notícia")} control={<Switch checked={selectedType === "Notícia"} />} label="Notícias" />
              <FormControlLabel sx={{ color: 'secondary.main' }} onClick={() => handleFilterByType("Release")} control={<Switch checked={selectedType === "Release"} />} label="Releases" />
            </Stack>
          </Container>
        </Box>
        <Container sx={{ paddingTop: 4 }} maxWidth="md">
          <Grid container spacing={4}>
            {theNews.map((news) => (
              <Grid item key={news.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      mt: -0.5,
                      mb: 1,
                      pt: '56.25%',
                      borderRadius: '3%',
                    }}
                    image={handleImg(news.imagens)}
                  />
                    <Typography gutterBottom variant="h5" component="h2">
                      {news.titulo}
                    </Typography>
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