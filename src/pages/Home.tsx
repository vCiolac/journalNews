import { Fragment, useState } from 'react';
import { useFetch } from '../Hooks/useFetch';
import useLocalStorage from '../Hooks/useLocalStorage';

const Home = () => {
  const { news, loading, error } = useFetch();
  const { localStorageValue, updateValue } = useLocalStorage<number[]>('favorites', []);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  if (loading) return (<div>Carregando...</div>);

  if (error) return (<div>{error}</div>);

  const getNineNews = () => {
    if (news?.length >= 9) {
      return news.slice(0, 9);
    }
    return news;
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

  return (
    <Fragment>
      <h1>Ultimas Noticias</h1>
      <button type="button" onClick={handleFilter}>{showFavorites ? 'Mostrar todas' : 'Mostrar favoritas'}</button>
      <div>
        {theNews.map((item) => (
          <div key={item.id}>
            <h1>{item.titulo}</h1>
            <p>{item.introducao}</p>
            <button type="button" onClick={ () => HandleClick(item.link) }>Ler mais</button>
            <button type="button" onClick={ () => HandleFavorite(item.id) }>{isFavorite(item.id) ? 'Desfavoritar' : 'Favoritar'}</button>
            <h5>{calculateDate(item.data_publicacao)}</h5>
            <span>{item.data_publicacao}</span>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default Home;
