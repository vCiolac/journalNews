import { useEffect, useState } from 'react';
import { NewsType } from '../components/types';

export function useFetch() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=100');
        if (!response.ok) {
          throw new Error('A resposta com a rede não foi bem-sucedida');
        }
        const data = await response.json();
        if (data && data.items) {
          setNews(data.items);
        }
        setLoading(false);
      } catch (erro) {
        setError(erro instanceof Error ? erro.message : 'Algum erro ocorreu');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { news, loading, error };
}
