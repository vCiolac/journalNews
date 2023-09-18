import { Fragment, useState } from 'react';
import { useFetch } from '../Hooks/useFetch';
import useLocalStorage from '../Hooks/useLocalStorage';
import { NewsType } from '../types';

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
    const dateParts = dateString.split(/[\s/:\-]+/);
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
    setSelectedType(type);
  };

  const handleResetFilters = () => {
    setResetSearch(true);
    handleFilterByType(null)
    setTitleFilter('');
  };

  return (
    <Fragment>
      <h1>Ultimas Noticias</h1>
      <button type="button" onClick={handleFilter}>{showFavorites ? 'Mostrar todas' : 'Mostrar favoritas'}</button>
      <div>
        <input
          type="text"
          placeholder="Filtrar por título"
          value={titleFilter}
          onChange={handleTitleFilterChange}
        />
        <button type="button" onClick={handleSearch}>Pesquisar</button>
        <button type="button" onClick={() => handleFilterByType(null)}>Todos</button>
        <button type="button" onClick={() => handleFilterByType("Notícia")}>Notícias</button>
        <button type="button" onClick={() => handleFilterByType("Release")}>Releases</button>
        <button type="button" onClick={handleResetFilters}>Limpar</button>
      </div>
      <div>
        {theNews.map((item) => (
          <div key={item.id}>
            <h1>{item.titulo}</h1>
            <p>{item.introducao}</p>
            <h3>{item.tipo}</h3>
            <button type="button" onClick={() => HandleClick(item.link)}>Ler mais</button>
            <button type="button" onClick={() => HandleFavorite(item.id)}>{isFavorite(item.id) ? 'Desfavoritar' : 'Favoritar'}</button>
            <h5>{calculateDate(item.data_publicacao)}</h5>
            <span>{item.data_publicacao}</span>
          </div>
        ))}
      </div>
      {!showFavorites && currentPage > 1 && (
        <button type="button" onClick={handlePrevPage}>Página Anterior</button>
      )}
      {!showFavorites && theNews.length >= 9 && (
        <button type="button" onClick={handleNextPage}>Próxima Página</button>
      )}
    </Fragment>
  );
}

export default Home;
