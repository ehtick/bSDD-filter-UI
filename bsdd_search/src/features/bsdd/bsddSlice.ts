import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';

import { BsddApi } from '../../../../common/src/BsddApi/BsddApi';
import {
  ClassContractV1,
  ClassListItemContractV1,
  ClassPropertyContractV1,
  DictionaryContractV1,
  RequestParams,
} from '../../../../common/src/BsddApi/BsddApiBase';
import { headers } from '../../../../common/src/BsddApi/BsddApiWrapper';
import type { RootState } from '../../app/store';
import { selectBsddApiEnvironmentUri } from '../settings/settingsSlice';

const CLASS_ITEM_PAGE_SIZE = 500;
const DICTIONARIES_PAGE_SIZE = 500;

interface BsddState {
  mainDictionaryClassification: ClassContractV1 | null;
  mainDictionaryClassificationUri: string | null;
  classes: { [key: string]: ClassContractV1 };
  propertyNamesByLanguage: { [languageCode: string]: { [propertyUri: string]: string } };
  dictionaries: { [key: string]: DictionaryContractV1 };
  dictionaryClasses: { [key: string]: ClassListItemContractV1[] };
  loaded: boolean;
  groupedClassRelations: { [key: string]: ClassContractV1[] };
}

let bsddApi: BsddApi<any> | null = null;

let fetchPromisesCache: Partial<Record<string, Promise<ClassListItemContractV1[]>>> = {};

const initialState: BsddState = {
  mainDictionaryClassification: null,
  mainDictionaryClassificationUri: null,
  classes: {},
  propertyNamesByLanguage: {},
  dictionaries: {},
  dictionaryClasses: {},
  loaded: false,
  groupedClassRelations: {},
};

/**
 * Selects the instance of the BsddApi class based on the current state.
 * If the base URL has changed or the instance doesn't exist, a new instance is created.
 *
 * @param state - The root state of the application.
 * @returns The selected instance of the BsddApi class.
 */
export const selectBsddApi = (state: RootState) => {
  const baseUrl = selectBsddApiEnvironmentUri(state);
  if (baseUrl && (!bsddApi || bsddApi.baseUrl !== baseUrl)) {
    bsddApi = new BsddApi(baseUrl);
  }
  return bsddApi;
};

export type FetchAllDictionaryParameters = {
  bsddApiEnvironment: string;
  includeTestDictionaries: boolean;
};

/**
 * Fetches dictionaries from the bSDD API.
 *
 * @param bsddApiEnvironment - The environment for the bSDD API.
 * @param thunkAPI - The Redux Thunk API.
 * @returns A promise that resolves to an object containing the fetched dictionaries.
 * @throws An error if there is an HTTP error or a bSDD API error.
 */
export const fetchAllDictionaries = createAsyncThunk<
  { [key: string]: DictionaryContractV1 },
  FetchAllDictionaryParameters,
  { rejectValue: string }
>('bsdd/fetchDictionaries', ({ bsddApiEnvironment, includeTestDictionaries }, thunkAPI) => {
  if (!bsddApiEnvironment) return thunkAPI.rejectWithValue('No bsddApiEnvironment provided');

  const api = new BsddApi(bsddApiEnvironment);
  const limit = DICTIONARIES_PAGE_SIZE;
  let offset = 0;
  const dictionaries: DictionaryContractV1[] = [];

  return new Promise((resolve, reject) => {
    function fetchNextPage() {
      api.api
        .dictionaryV1List({ IncludeTestDictionaries: includeTestDictionaries, Limit: limit, Offset: offset })
        .then((response) => {
          if (!response.ok) {
            reject(new Error(`HTTP error! status: ${response.status}`));
          }

          const { data: { dictionaries: newDictionaries, totalCount } = {} } = response;
          if (newDictionaries && typeof totalCount !== 'undefined') {
            dictionaries.push(...newDictionaries);
            offset += limit;
            if (dictionaries.length >= totalCount) {
              const out = dictionaries.reduce((acc: { [key: string]: DictionaryContractV1 }, item) => {
                acc[item.uri] = item;
                return acc;
              }, {});
              resolve(out);
            } else {
              fetchNextPage();
            }
          } else {
            reject(new Error(`bSDD API error! status: ${response.status}`));
          }
        });
    }

    fetchNextPage();
  });
});

export type FetchDictionaryParameters = {
  bsddApiEnvironment: string;
  includeTestDictionaries: boolean;
  dictionaryUris?: string[];
};

export const fetchDictionaries = createAsyncThunk<
  { [key: string]: DictionaryContractV1 },
  FetchDictionaryParameters, // Assuming this type now includes dictionaryUris: string[]
  { rejectValue: string }
>('bsdd/fetchDictionaries', async ({ bsddApiEnvironment, dictionaryUris }, thunkAPI) => {
  if (!bsddApiEnvironment || !dictionaryUris || dictionaryUris.length === 0) {
    return thunkAPI.rejectWithValue('Invalid parameters');
  }

  const api = new BsddApi(bsddApiEnvironment);
  const dictionaries: { [key: string]: DictionaryContractV1 } = {};

  await Promise.all(
    dictionaryUris.map(async (uri) => {
      try {
        const response = await api.api.dictionaryV1List({ Uri: uri }, { headers });
        if (response.ok && response.data) {
          // Assuming response.data is an array of dictionaries
          response.data.dictionaries?.forEach((dictionary: DictionaryContractV1) => {
            dictionaries[dictionary.uri] = dictionary;
          });
        } else {
          console.error(`Failed to fetch dictionaries for URI: ${uri}`);
        }
      } catch (error) {
        console.error(`Error fetching dictionaries for URI: ${uri}`, error);
      }
    }),
  );

  return dictionaries;
});

/**
 * Fetches a specific batch of dictionary class data from the API.
 *
 * @param api - The instance of the BsddApi.
 * @param location - The location of the dictionary.
 * @param offset - The offset for pagination.
 * @returns The fetched dictionary class data.
 * @throws Error if there is an HTTP error.
 */
async function fetchDictionaryClassData(
  api: BsddApi<any>,
  location: string,
  offset: number,
  languageCode: string | undefined,
) {
  const response = await api.api.dictionaryV1ClassesList(
    {
      Uri: location,
      UseNestedClasses: false,
      ClassType: 'Class',
      Offset: offset,
      Limit: CLASS_ITEM_PAGE_SIZE,
      languageCode,
    },
    { headers },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.data;
}

const fetchAllDictionaryClasses = async (api: BsddApi<any>, location: string, languageCode: string) => {
  const classes = [];
  let offset = 0;

  const initialData = await fetchDictionaryClassData(api, location, offset, languageCode);
  const totalCount = initialData.classesTotalCount;
  if (totalCount === null || totalCount === undefined) {
    throw new Error('Total count is null or undefined');
  }
  classes.push(...(initialData.classes ?? []));

  const fetchPromises = [];
  for (offset = CLASS_ITEM_PAGE_SIZE; offset < totalCount; offset += CLASS_ITEM_PAGE_SIZE) {
    fetchPromises.push(fetchDictionaryClassData(api, location, offset, languageCode));
  }

  const results = await Promise.all(fetchPromises);
  results.forEach((data) => {
    classes.push(...(data.classes ?? []));
  });

  return classes;
};

export const fetchDictionaryClasses = createAsyncThunk(
  'bsdd/fetchDictionaryClasses',
  async ({ location, languageCode }: { location: string; languageCode: string }, { getState, dispatch }) => {
    const state = getState() as RootState;

    if (state.bsdd.dictionaryClasses[location]) {
      return state.bsdd.dictionaryClasses[location];
    }

    if (fetchPromisesCache[location]) {
      return fetchPromisesCache[location];
    }

    const api = selectBsddApi(state);
    if (!api) {
      throw new Error('BsddApi is not initialized');
    }

    const fetchPromise = fetchAllDictionaryClasses(api, location, languageCode)
      .then((classes) => {
        dispatch({ type: 'bsdd/addDictionaryClasses', payload: { uri: location, data: classes } });
        return classes;
      })
      .finally(() => {
        delete fetchPromisesCache[location];
      });

    fetchPromisesCache[location] = fetchPromise;
    return fetchPromise;
  },
);

export type FetchAndStoreAllDictionaryClassesParameters = {
  dictionaryUris?: string[];
  languageCode: string;
};

export const fetchAndStoreDictionaryClasses = createAsyncThunk(
  'bsdd/fetchAndStoreAllDictionaryClasses',
  async (params: FetchAndStoreAllDictionaryClassesParameters, { dispatch, rejectWithValue }) => {
    const { dictionaryUris, languageCode } = params;
    if (!dictionaryUris || dictionaryUris.length === 0) {
      return rejectWithValue('No dictionary URIs provided');
    }

    try {
      await Promise.all(dictionaryUris.map((uri) => dispatch(fetchDictionaryClasses({ location: uri, languageCode }))));
      return 'Successfully fetched and stored all dictionary classes';
    } catch (error) {
      return rejectWithValue('Failed to fetch dictionary classes');
    }
  },
);

export const updateDictionaries = createAsyncThunk(
  'bsdd/updateDictionaries',
  async (activeDictionaryLocations: string[]) => activeDictionaryLocations,
);

// Workaround for bSDD not supporting translated property names on the class endpoint
export const updatePropertyNaturalLanguageNames = createAsyncThunk(
  'bsdd/updatePropertyNaturalLanguageNames',
  async ({ classProperties, languageCode }: { classProperties: ClassPropertyContractV1[]; languageCode: string }) => {
    if (!bsddApi) {
      throw new Error('BsddApi is not initialized');
    }

    const propertyNames: { [propertyUri: string]: string } = {};

    const fetchPropertyDetails = async (property: ClassPropertyContractV1) => {
      if (bsddApi?.api && property.propertyUri) {
        try {
          const response = await bsddApi.api.propertyV4List(
            {
              uri: property.propertyUri,
              languageCode,
              includeClasses: false,
            },
            { headers },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const { data } = response;

          // Use the translated name if available, otherwise use the class property name
          propertyNames[property.propertyUri] = data.name || property.name;
        } catch (error) {
          console.error('Error fetching property details:', error);
          // Use the class property name as a fallback in case of an error
          propertyNames[property.propertyUri] = property.name;
        }
      }
    };

    const propertyFetchPromises = classProperties.map(fetchPropertyDetails);
    await Promise.all(propertyFetchPromises);

    return { languageCode, propertyNames };
  },
);

const bsddSlice = createSlice({
  name: 'bsdd',
  initialState,
  reducers: {
    resetState: () => initialState,
    setMainDictionaryClassification: (state, action: PayloadAction<ClassContractV1 | null>) => {
      state.mainDictionaryClassification = action.payload;
    },
    setMainDictionaryClassificationUri: (state, action: PayloadAction<string | null>) => {
      state.mainDictionaryClassificationUri = action.payload;
    },
    setClasses: (state, action: PayloadAction<{ [key: string]: ClassContractV1 }>) => {
      state.classes = action.payload;
    },
    // addClass: (state, action: PayloadAction<{ uri: string; data: ClassContractV1 }>) => {
    //   console.log('addClass', action.payload);
    //   state.classes[action.payload.uri] = action.payload.data;
    // },
    addDictionaryClasses: (state, action: PayloadAction<{ uri: string; data: ClassListItemContractV1[] }>) => {
      if (state.dictionaryClasses[action.payload.uri]) {
        state.dictionaryClasses[action.payload.uri] = [
          ...state.dictionaryClasses[action.payload.uri],
          ...action.payload.data,
        ];
      } else {
        state.dictionaryClasses[action.payload.uri] = action.payload.data;
      }
    },
    addDictionary: (state, action: PayloadAction<DictionaryContractV1>) => {
      state.dictionaries[action.payload.uri] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        updatePropertyNaturalLanguageNames.fulfilled,
        (state, action: PayloadAction<{ languageCode: string; propertyNames: { [propertyUri: string]: string } }>) => {
          const { languageCode, propertyNames } = action.payload;
          state.propertyNamesByLanguage[languageCode] = propertyNames;
        },
      )
      .addCase(fetchAllDictionaries.pending, (state) => {
        state.loaded = false;
      })
      .addCase(
        fetchAllDictionaries.fulfilled,
        (state, action: PayloadAction<{ [key: string]: DictionaryContractV1 }>) => {
          state.dictionaries = action.payload;
          state.loaded = true;
        },
      )
      .addCase(fetchDictionaryClasses.rejected, (state, action) => {
        console.error('fetch dictionary classes failed', action.error);
        state.loaded = true;
      })
      .addCase(updateDictionaries.fulfilled, (state: BsddState, action) => {
        const activeLocations = action.payload;
        state.dictionaries = Object.keys(state.dictionaries)
          .filter((uri) => activeLocations.includes(uri))
          .reduce((acc: { [uri: string]: DictionaryContractV1 }, uri) => {
            acc[uri] = state.dictionaries[uri];
            return acc;
          }, {});
      });
  },
});

// fetch classes without any relationships and properties
export const fetchClasses = createAsyncThunk(
  'bsdd/fetchClasses',
  async (relatedClassUris: string[], { getState, dispatch }) => {
    const state = getState() as RootState;
    const languageCode = state.settings.language;

    if (!bsddApi) {
      throw new Error('BsddApi is not initialized');
    }

    const classesAccumulator: { [key: string]: ClassContractV1 } = { ...state.bsdd.classes };

    const fetchClass = async (relatedClassUri: string) => {
      if (classesAccumulator[relatedClassUri]) {
        return;
      }

      if (bsddApi && bsddApi.api) {
        const response = await bsddApi.api.classV1List({
          Uri: relatedClassUri,
          languageCode,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = response;
        classesAccumulator[relatedClassUri] = data;
      } else {
        throw new Error('bsddApi or bsddApi.api is not initialized');
      }
    };

    const classFetchPromises = relatedClassUris.map(fetchClass);
    await Promise.all(classFetchPromises);

    dispatch({ type: 'bsdd/setClasses', payload: classesAccumulator });
  },
);

export const selectMainDictionaryClassification = (state: RootState) => state.bsdd.mainDictionaryClassification;
export const selectMainDictionaryClassificationUri = (state: RootState) => state.bsdd.mainDictionaryClassificationUri;
export const selectDictionary = (state: RootState, uri: string) => state.bsdd.dictionaries[uri];
export const selectDictionaryClasses = (state: RootState, location: string) => state.bsdd.dictionaryClasses[location];
export const selectBsddDictionaries = (state: RootState) => state.bsdd.dictionaries;
export const selectBsddDataLoaded = (state: RootState) => state.bsdd.loaded;
export const selectdictionaryClasses = (state: RootState) => state.bsdd.dictionaryClasses;
export const selectGroupedClassRelations = (state: RootState) => state.bsdd.groupedClassRelations;
export const selectClasses = (state: RootState) => state.bsdd.classes;
export const selectPropertyNamesByLanguage = (state: RootState) => state.bsdd.propertyNamesByLanguage;

export const selectGroupedClasses = createSelector([selectClasses], (classes) => {
  type GroupedClasses = { [key: string]: ClassContractV1[] };
  const classesArray = Object.values(classes);
  const grouped = classesArray.reduce<GroupedClasses>((acc, currentClass) => {
    const { dictionaryUri } = currentClass;
    if (dictionaryUri) {
      if (!acc[dictionaryUri]) {
        acc[dictionaryUri] = [];
      }
      acc[dictionaryUri].push(currentClass);
    }
    return acc;
  }, {});

  return grouped;
});

export const {
  resetState,
  setMainDictionaryClassification,
  setMainDictionaryClassificationUri,
  addDictionaryClasses,
  addDictionary,
} = bsddSlice.actions;

// fetch the main dictionary class including all relationships and properties
export const fetchMainDictionaryClassification = createAsyncThunk(
  'bsdd/fetchMainDictionaryClassification',
  async (classificationUri: string, { getState, dispatch }) => {
    if (!bsddApi) {
      throw new Error('BsddApi is not initialized');
    }
    const state = getState() as RootState;
    const languageCode = state.settings.language;

    const params: RequestParams = {
      headers,
    };

    const queryParameters = {
      Uri: classificationUri,
      IncludeClassRelations: true,
      IncludeClassProperties: true,
      languageCode,
    };

    try {
      const response = await bsddApi.api.classV1List(queryParameters, params);
      if (response.status !== 200) {
        console.error(`API request failed with status ${response.status}`);
        return null;
      }
      const classification = response.data;
      dispatch(setMainDictionaryClassification(classification));

      return classification;
    } catch (err) {
      console.error('Error fetching classification:', err);
      return null;
    }
  },
);

export const updateMainDictionaryClassificationUri = createAsyncThunk(
  'bsdd/updateMainDictionaryClassificationUri',
  async (uri: string | null, { dispatch, getState }) => {
    const state = getState() as RootState;
    if (uri !== state.bsdd.mainDictionaryClassificationUri) {
      dispatch(bsddSlice.actions.setMainDictionaryClassificationUri(uri));
      if (uri === null) {
        dispatch(bsddSlice.actions.setMainDictionaryClassification(null));
      } else {
        // Fetch the main dictionary classification based on the URI
        const action = await dispatch(fetchMainDictionaryClassification(uri));
        const mainDictionaryClassification = action.payload as ClassContractV1 | null;
        dispatch(bsddSlice.actions.setMainDictionaryClassification(mainDictionaryClassification));

        if (mainDictionaryClassification?.classRelations) {
          const relatedClassUris = mainDictionaryClassification.classRelations.map(
            (relation) => relation.relatedClassUri,
          );
          relatedClassUris.push(mainDictionaryClassification.uri);
          await dispatch(fetchClasses(relatedClassUris));
        }
      }
    }
  },
);

/**
 * Updates the base URL of the BsddApi and resets the state.
 * @param baseUrl The new base URL for the BsddApi.
 */
export function updateBsddApi(baseUrl: string) {
  return (dispatch: ThunkDispatch<unknown, unknown, UnknownAction>) => {
    bsddApi = new BsddApi(baseUrl);
    fetchPromisesCache = {};
    dispatch(resetState());
  };
}

export const bsddReducer = bsddSlice.reducer;
