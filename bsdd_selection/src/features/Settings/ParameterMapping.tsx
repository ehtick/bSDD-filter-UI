import { Accordion, Text, TextInput, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BsddDictionary, BsddSettings } from '../../../../common/src/IfcData/bsddBridgeData';

interface ParameterMappingProps {
  id: number;
  localSettings: BsddSettings;
  setLocalSettings: (settings: BsddSettings) => void;
  setUnsavedChanges: (unsavedChanges: boolean) => void;
}

function ParameterMapping({
  id,
  localSettings: settings,
  setLocalSettings: setSettings,
  setUnsavedChanges,
}: ParameterMappingProps) {
  const { t } = useTranslation();
  const { mainDictionary, filterDictionaries } = settings;

  const [mappableDictionaries, setMappableDictionaries] = useState<BsddDictionary[]>([]);

  useEffect(() => {
    const dictionaries = [mainDictionary, ...filterDictionaries].filter(Boolean) as BsddDictionary[];
    const dictionaryMap = new Map(dictionaries.map((item) => [item.ifcClassification.location, item]));
    const uniqueDictionaries = Array.from(dictionaryMap.values());

    setMappableDictionaries(uniqueDictionaries);
  }, [mainDictionary, filterDictionaries]);

  const handleInputChange = (dictionaryUri: string | undefined, newParameterMapping: string) => {
    if (!settings) return;
    const newSettings = { ...settings };
    if (newSettings.mainDictionary?.ifcClassification.location === dictionaryUri) {
      const newMainDictionary: BsddDictionary = {
        ...(newSettings.mainDictionary as BsddDictionary),
        parameterMapping: newParameterMapping,
      };
      newSettings.mainDictionary = newMainDictionary;
    } else {
      newSettings.filterDictionaries = newSettings.filterDictionaries.map((dictionary) => {
        if (dictionary.ifcClassification.location === dictionaryUri) {
          return { ...dictionary, parameterMapping: newParameterMapping };
        }
        return dictionary;
      });
    }
    setSettings(newSettings);
    setUnsavedChanges(true);
  };

  return (
    <Accordion.Item key={id} value={id.toString()}>
      <Accordion.Control>
        <Title order={5}>{t('parameterMappingLabel')}</Title>
        <Text size="xs" c="dimmed">
          {t('parameterMappingInstruction')}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        {mappableDictionaries.map((dictionary, dictionaryIndex) => {
          const dictionaryKey = dictionary.ifcClassification.location || dictionaryIndex;
          return (
            <div key={dictionaryKey} style={{ marginBottom: '1em' }}>
              <TextInput
                label={dictionary.ifcClassification.location}
                placeholder="Enter a revit type parameter"
                value={dictionary.parameterMapping}
                onChange={(event) =>
                  handleInputChange(dictionary.ifcClassification.location, event.currentTarget.value)
                }
              />{' '}
            </div>
          );
        })}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default ParameterMapping;
