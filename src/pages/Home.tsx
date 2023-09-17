import React, { Fragment } from 'react';
import { useFetch } from '../Hooks/useFetch';
import useLocalStorage from '../Hooks/useLocalStorage';

const Home = () => {
  const { news, loading, error } = useFetch();
  const { localStorageValue, updateValue } = useLocalStorage<number[]>('favorites', []);

  if (loading) return (<div>Carregando...</div>);

  if (error) return (<div>{error}</div>);

  const getNineNews = () => {
    if (news?.length >= 9) {
      return news.slice(0, 9);
    }
    return news;
  };
  
  const nineNews = getNineNews();

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

  return (
    <Fragment>
      <h1>Ultimas Noticias</h1>
      <div>
        {nineNews.map((item) => (
          <div key={item.id}>
            <h1>{item.titulo}</h1>
            <p>{item.introducao}</p>
            <span>{item.data_publicacao}</span>
            <button type="button" onClick={ () => HandleClick(item.link) }>Ler mais</button>
            <button type="button" onClick={ () => HandleFavorite(item.id) }>{isFavorite(item.id) ? 'Desfavoritar' : 'Favoritar'}</button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default Home;
