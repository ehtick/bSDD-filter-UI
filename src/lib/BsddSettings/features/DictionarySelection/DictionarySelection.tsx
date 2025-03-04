import { Accordion, ComboboxItem, MultiSelect, Space, Text, Title } from '@mantine/core';
import { createSelector } from '@reduxjs/toolkit';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../common/app/hooks';
import { DictionaryContractV1 } from '../../../common/BsddApi/BsddApiBase';
import { DraggableMultiSelect } from '../../../common/components/DraggableMultiSelect/DraggableMultiSelect';
import { BsddDictionary, BsddSettings } from '../../../common/IfcData/bsddBridgeData';
import { convertBsddDictionaryToIfcClassification } from '../../../common/IfcData/ifcBsddConverters';
import { selectBsddDictionaries } from '../../../common/slices/bsddSlice';

interface DictionarySelectionProps {
  id: number;
  localSettings: BsddSettings;
  setLocalSettings: (settings: BsddSettings) => void;
  setUnsavedChanges: (unsavedChanges: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const IFC_DICTIONARY_URL = 'https://identifier.buildingsmart.org/uri/buildingsmart/ifc/';
const DEFAULT_IFC_PARAMETER = 'Export Type to IFC As';

/**
 * Finds a dictionary in the given array of dictionaries based on the provided URI.
 *
 * @param dictionaries - The array of dictionaries to search.
 * @param uri - The URI of the dictionary to find.
 * @returns The dictionary object if found, or undefined if not found.
 */
function findDictionaryByUri(dictionaries: DictionaryContractV1[], uri: string | null) {
  return Object.values(dictionaries).find((item) => item.uri === uri);
}

/**
 * Converts a dictionary object to a BsddDictionary object.
 * If the dictionary is null, returns null.
 * If the dictionary is not found in the previousSelections array, creates a new BsddDictionary object.
 *
 * @param {DictionaryContractV1 | null} dictionary - The dictionary object to convert.
 * @param {BsddDictionary[]} previousSelections - The array of previously selected dictionaries.
 * @returns {BsddDictionary | null} The converted BsddDictionary object or null if the dictionary is null.
 */
function convertToBsddDictionary(
  dictionary: DictionaryContractV1 | null | undefined,
  previousSelections: BsddDictionary[],
  parameterMapping = '',
): BsddDictionary | null {
  if (!dictionary) return null;

  const previousSelection = previousSelections.find((item) => item.ifcClassification.location === dictionary.uri);

  // If the dictionary was previously selected, return it as is to preserve its parameterMapping
  if (previousSelection) return previousSelection;

  return {
    ifcClassification: convertBsddDictionaryToIfcClassification(dictionary),
    parameterMapping,
  };
}

const selectBsddDictionaryOptions = createSelector(selectBsddDictionaries, (bsddDictionaries) => {
  const uniqueOptionsMap = new Map<string, ComboboxItem>();

  Object.values(bsddDictionaries).forEach((item) => {
    uniqueOptionsMap.set(item.uri, {
      value: item.uri,
      label: `${item.name} (${item.version})`,
    } as ComboboxItem);
  });

  return Array.from(uniqueOptionsMap.values());
});

const getComboboxItem = (item: any): ComboboxItem[] => {
  return item && item.ifcClassification && item.ifcClassification.location
    ? [
        {
          value: item.ifcClassification.location,
          label: item.ifcClassification.name || '',
        },
      ]
    : [];
};

const selectIfcDictionaryOptions = createSelector(selectBsddDictionaryOptions, (bsddDictionaryOptions) =>
  bsddDictionaryOptions.filter((option) => option.value.startsWith(IFC_DICTIONARY_URL)),
);

const selectFilterDictionaryOptions = createSelector(selectBsddDictionaryOptions, (bsddDictionaryOptions) =>
  bsddDictionaryOptions.filter((option) => !option.value.startsWith(IFC_DICTIONARY_URL)),
);

function DictionarySelection({
  id,
  localSettings,
  setLocalSettings,
  setUnsavedChanges,
  setIsLoading,
}: DictionarySelectionProps) {
  const { t } = useTranslation();
  const bsddDictionaries = useAppSelector(selectBsddDictionaries);
  const bsddDictionaryOptions = useAppSelector(selectBsddDictionaryOptions);
  const bsddIfcDictionaryOptions = useAppSelector(selectIfcDictionaryOptions);
  const bsddFilterDictionaryOptions = useAppSelector(selectFilterDictionaryOptions);

  const localMainDictionaryValues = useMemo(() => {
    return getComboboxItem(localSettings?.mainDictionary);
  }, [localSettings?.mainDictionary]);

  const localIfcDictionaryValues = useMemo(() => {
    return getComboboxItem(localSettings?.ifcDictionary);
  }, [localSettings?.ifcDictionary]);

  const localFilterDictionaryValues = useMemo(() => {
    return (
      localSettings?.filterDictionaries
        ?.filter((item) => item.ifcClassification && item.ifcClassification.location)
        .map(getComboboxItem)
        .flat() || []
    );
  }, [localSettings?.filterDictionaries]);

  const changeMainDictionaryOption = useCallback(
    (selectedMainDictionaryUris: string[]) => {
      const latestSelectedUri = selectedMainDictionaryUris[selectedMainDictionaryUris.length - 1];
      const selectedMainDictionary = findDictionaryByUri(Object.values(bsddDictionaries), latestSelectedUri) || null;

      const newMainDictionary = convertToBsddDictionary(
        selectedMainDictionary,
        localSettings.mainDictionary ? [localSettings.mainDictionary] : [],
      );
      const newFilterDictionaries = localSettings.filterDictionaries.filter(
        (dictionary) => dictionary.ifcClassification.location !== latestSelectedUri,
      );

      const newIfcDictionary =
        latestSelectedUri && latestSelectedUri.includes(IFC_DICTIONARY_URL)
          ? newMainDictionary
          : localSettings.ifcDictionary;

      setLocalSettings({
        ...localSettings,
        mainDictionary: newMainDictionary || null,
        ifcDictionary: newIfcDictionary || null,
        filterDictionaries: newFilterDictionaries,
      } as BsddSettings);
      setUnsavedChanges(true);
    },
    [bsddDictionaries, localSettings, setLocalSettings, setUnsavedChanges],
  );

  const changeIfcDictionaryOption = useCallback(
    (selectedIfcDictionaryUris: string[]) => {
      const latestSelectedUri = selectedIfcDictionaryUris[selectedIfcDictionaryUris.length - 1];
      const selectedIfcDictionary = findDictionaryByUri(Object.values(bsddDictionaries), latestSelectedUri) || null;

      const parameterMapping: string = localSettings.ifcDictionary?.parameterMapping || DEFAULT_IFC_PARAMETER;
      const newIfcDictionary = convertToBsddDictionary(
        selectedIfcDictionary,
        localSettings.ifcDictionary ? [localSettings.ifcDictionary] : [],
        parameterMapping,
      );
      const newFilterDictionaries = localSettings.filterDictionaries.filter(
        (dictionary) => dictionary.ifcClassification.location !== latestSelectedUri,
      );

      setLocalSettings({
        ...localSettings,
        ifcDictionary: newIfcDictionary || null,
        filterDictionaries: newFilterDictionaries,
      } as BsddSettings);
      setUnsavedChanges(true);
    },
    [bsddDictionaries, localSettings, setLocalSettings, setUnsavedChanges],
  );

  const changeFilterDictionaries = useCallback(
    (selectedFilterDictionaryUris: string[]) => {
      const newFilterDictionaries: BsddDictionary[] = selectedFilterDictionaryUris
        .map((uri) => findDictionaryByUri(Object.values(bsddDictionaries), uri))
        .map((item) => convertToBsddDictionary(item, localSettings?.filterDictionaries || []))
        .filter(
          (item) =>
            item !== null &&
            item.ifcClassification.location !== localSettings?.mainDictionary?.ifcClassification.location &&
            item.ifcClassification.location !== localSettings?.ifcDictionary?.ifcClassification.location,
        ) as BsddDictionary[];

      const getNewDictionary = (dictionaryValues: ComboboxItem[], dictionary: BsddDictionary | null | undefined) =>
        dictionaryValues && selectedFilterDictionaryUris.includes(dictionaryValues[0]?.value) ? null : dictionary;

      const newMainDictionary = getNewDictionary(localMainDictionaryValues, localSettings?.mainDictionary);
      const newIfcDictionary = getNewDictionary(localIfcDictionaryValues, localSettings?.ifcDictionary);

      const newLocalSettings = {
        ...localSettings,
        mainDictionary: newMainDictionary,
        ifcDictionary: newIfcDictionary,
        filterDictionaries: newFilterDictionaries,
      } as BsddSettings;
      setLocalSettings(newLocalSettings);
      setUnsavedChanges(true);
    },
    [
      bsddDictionaries,
      localMainDictionaryValues,
      localSettings,
      localIfcDictionaryValues,
      setLocalSettings,
      setUnsavedChanges,
    ],
  );

  // Set filter dictionary options for use in select
  useEffect(() => {
    if (bsddDictionaryOptions.length === 0) return;
    setIsLoading(false);
  }, [bsddDictionaryOptions, setIsLoading]);

  return (
    <Accordion.Item key={id} value={id.toString()}>
      <Accordion.Control>
        <Title order={5}>{t('dictionarySelectionLabel')}</Title>
        <Text size="xs" c="dimmed">
          {t('dictionarySelectionInstruction')}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <MultiSelect
          key="mainDictionary-select"
          id="mainDictionary"
          label={t('selectMainDictionary')}
          value={localMainDictionaryValues.map((item) => item.value)}
          onChange={changeMainDictionaryOption}
          placeholder="Select main dictionary"
          data={bsddDictionaryOptions}
          searchable
          clearable
        />
        <Space h="xs" />
        <MultiSelect
          key="ifcDictionary-select"
          id="ifcDictionary"
          label={t('selectIfcDictionary')}
          value={localIfcDictionaryValues.map((item) => item.value)}
          onChange={changeIfcDictionaryOption}
          placeholder="Select filter dictionaries"
          data={bsddIfcDictionaryOptions}
          searchable
          clearable
        />
        <Space h="xs" />
        <DraggableMultiSelect
          key="filterDictionaries-select"
          id="filterDictionaries"
          label={t('selectFilterDictionaries')}
          value={localFilterDictionaryValues.map((item) => item.value)}
          onChange={changeFilterDictionaries}
          placeholder="Select filter dictionaries"
          data={bsddFilterDictionaryOptions}
          searchable
          clearable
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default DictionarySelection;
