import React, { useEffect } from 'react';
import { List, message } from 'antd';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchPokemons = createAsyncThunk('pokemons/fetchPokemons', async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  return response.data.results;
});

const pokemonSlice = createSlice({
  name: 'pokemons',
  initialState: { entities: [], loading: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.entities = action.payload;
      });
  },
});

const store = configureStore({
  reducer: {
    pokemons: pokemonSlice.reducer,
  },
});

function PokemonList() {
  const dispatch = useDispatch();
  const { entities: pokemons, loading } = useSelector(state => state.pokemons);

  useEffect(() => {
    dispatch(fetchPokemons());
  }, [dispatch]);

  if (loading === 'loading') return <p>Loading...</p>;

  return (
    <List
      itemLayout="horizontal"
      dataSource={pokemons}
      renderItem={pokemon => (
        <List.Item>
          <List.Item.Meta
            title={pokemon.name}
            description={
              <img
                alt={pokemon.name}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[pokemon.url.split('/').length - 2]}.png`}
              />
            }
          />
        </List.Item>
      )}
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <PokemonList />
    </Provider>
  );
}

export default App;
