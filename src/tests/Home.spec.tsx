import NewsData from './NewsData';
import App from '../App';
import { render } from '@testing-library/react';

describe('Componente Home', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => NewsData,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o componente Home corretamente', () => {
    render(<App />);

    const titleElement = screen.getByText(/Termo News/i);
    expect(titleElement).toBeInTheDocument();

    const showFavoritesButton = screen.getByText(/Mostrar favoritos/i);
    expect(showFavoritesButton).toBeInTheDocument();
  });
});
