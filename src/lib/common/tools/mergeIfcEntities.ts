import {
  Association,
  IfcClassificationReference,
  IfcEntity,
  IfcProperty,
  IfcPropertyEnumeratedValue,
  IfcPropertySet,
  IfcPropertySingleValue,
} from '../IfcData/ifc';

const ATTRIBUTES: (keyof IfcEntity)[] = ['type', 'name', 'description', 'objectType', 'tag', 'predefinedType'] as const;
const IFC_ENTITY_STRING_ATTRIBUTES = ['name', 'description', 'objectType', 'tag'] as const;

const mergeStringProperties = (values: (string | undefined)[]): string | undefined => {
  const normalizedValues = values.map((value) => (value === undefined ? '' : value));
  const uniqueValues = Array.from(new Set(normalizedValues));

  if (uniqueValues.length === 1) {
    return uniqueValues[0] === '' ? undefined : uniqueValues[0];
  }

  return '...';
};

const mergeProperties = (setsWithName: IfcPropertySet[]): IfcProperty[] => {
  const propertyMap: Map<string, IfcProperty[]> = new Map();

  setsWithName.forEach((ps) => {
    ps.hasProperties.forEach((prop) => {
      if (prop && prop.name) {
        if (!propertyMap.has(prop.name)) {
          propertyMap.set(prop.name, []);
        }
        propertyMap.get(prop.name)!.push(prop as IfcProperty);
      }
    });
  });

  return Array.from(propertyMap.entries())
    .map(([name, properties]) => {
      const serializedProperties = properties.map((property) => JSON.stringify(property));
      const allEqual = serializedProperties.every((val, i, arr) => val === arr[0]);
      return allEqual ? properties[0] : undefined;
    })
    .filter((property): property is IfcProperty => property !== undefined);
};

const mergePropertySets = (propertySets: IfcPropertySet[]): IfcPropertySet[] => {
  const propertySetMap: Map<string, IfcPropertySet[]> = new Map();

  propertySets.forEach((propertySet) => {
    const key = propertySet.name || '';
    if (!propertySetMap.has(key)) {
      propertySetMap.set(key, []);
    }
    propertySetMap.get(key)!.push(propertySet);
  });

  return Array.from(propertySetMap.entries()).map(([name, propertySets]) => ({
    type: 'IfcPropertySet',
    name,
    hasProperties: mergeProperties(propertySets),
  }));
};

const mergeAssociations = (associations: Association[]): Association[] => {
  // Filter out all IfcMaterial objects
  const classificationReferences = associations.filter(
    (assoc): assoc is IfcClassificationReference => assoc.type === 'IfcClassificationReference',
  );

  const groupedAssociations: { [key: string]: IfcClassificationReference[] } = {};

  // Group associations by referencedSource.location
  classificationReferences.forEach((assoc) => {
    const referencedSourceLocation = assoc.referencedSource?.location;
    if (referencedSourceLocation) {
      if (!groupedAssociations[referencedSourceLocation]) {
        groupedAssociations[referencedSourceLocation] = [];
      }
      // Check for duplicate IfcClassificationReference.location within the group
      const isDuplicate = groupedAssociations[referencedSourceLocation].some(
        (existingAssoc) => existingAssoc.location === assoc.location,
      );
      if (!isDuplicate) {
        groupedAssociations[referencedSourceLocation].push(assoc);
      }
    }
  });

  const mergedAssociations: IfcClassificationReference[] = [];

  // Process each group
  Object.keys(groupedAssociations).forEach((referencedSourceLocation) => {
    const group = groupedAssociations[referencedSourceLocation];
    if (group.length === 1) {
      mergedAssociations.push(group[0]);
    }
  });

  return mergedAssociations;
};

/**
 * Merges an array of IfcEntity objects into a single IfcEntity object.
 *
 * @param ifcEntities - An array of IfcEntity objects to be merged.
 * @returns The merged IfcEntity object, or null if the input array is empty.
 */
export const mergeIfcEntities = (ifcEntities: IfcEntity[]): IfcEntity | null => {
  if (ifcEntities.length === 0) return null;

  const mergedIfcEntity: IfcEntity = IFC_ENTITY_STRING_ATTRIBUTES.reduce(
    (acc, prop) => {
      const inputValues = ifcEntities.map((entity) => entity[prop] || undefined);
      const mergedValue = mergeStringProperties(inputValues);
      acc[prop] = mergedValue;
      return acc;
    },
    {} as Record<(typeof IFC_ENTITY_STRING_ATTRIBUTES)[number], string | undefined>,
  );

  mergedIfcEntity.isDefinedBy = ifcEntities.some((entity) => entity.isDefinedBy)
    ? mergePropertySets(ifcEntities.flatMap((entity) => entity.isDefinedBy || []))
    : undefined;

  mergedIfcEntity.hasAssociations = ifcEntities.some((entity) => entity.hasAssociations)
    ? mergeAssociations(ifcEntities.flatMap((entity) => entity.hasAssociations || []))
    : undefined;

  return mergedIfcEntity;
};

/**
 * Creates an object of attribute names and their corresponding values from the given IFC entity.
 *
 * @param sourceEntity - The IFC entity from which to extract the attributes.
 * @returns An object where the keys are attribute names and the values are the corresponding attribute values.
 */
const getAttributes = (sourceEntity: IfcEntity): { [key: string]: string } => {
  return IFC_ENTITY_STRING_ATTRIBUTES.reduce(
    (acc, prop) => {
      const value = sourceEntity[prop];
      if (value !== undefined && value !== '...') {
        acc[prop] = value;
      }
      return acc;
    },
    {} as { [key: string]: string },
  );
};

/**
 * Creates a map of associations based on their location if they are of type 'IfcClassificationReference'.
 *
 * @param associations - An array of Association objects or undefined.
 * @returns A Map where the keys are the locations of the referenced sources and the values are the corresponding IfcClassificationReference associations, or null if the input is undefined.
 */
const getAssociationsMap = (
  associations: Association[] | undefined,
): Map<string, IfcClassificationReference> | null => {
  if (!associations) return null;

  return associations.reduce((acc, assoc) => {
    if (assoc.type === 'IfcClassificationReference' && assoc.referencedSource?.location) {
      acc.set(assoc.referencedSource.location, assoc);
    }
    return acc;
  }, new Map<string, IfcClassificationReference>());
};

/**
 * Creates a map of property sets based on their names.
 *
 * @param propertySets - An array of IfcPropertySet objects or undefined.
 * @returns A Map where the keys are property set names and the values are the corresponding IfcPropertySet objects, or null if the input is undefined.
 */
const getPropertySetsMap = (propertySets: IfcPropertySet[] | undefined): Map<string, IfcPropertySet> | null => {
  if (!propertySets) return null;

  return propertySets.reduce((acc, propertySet) => {
    const key = propertySet.name || '';
    acc.set(key, propertySet);
    return acc;
  }, new Map<string, IfcPropertySet>());
};

/**
 * Updates the target associations with the source associations.
 *
 * @param sourceAssociationsMap - A map where the key is a string representing the location and the value is an IfcClassificationReference.
 * @param targetAssociations - An optional array of Association objects to be updated.
 * @returns An array of updated Association objects.
 */
const updateAssociations = (
  sourceAssociationsMap: Map<string, IfcClassificationReference>,
  targetAssociations: Association[] | undefined,
): Association[] => {
  const targetAssociationsMap = getAssociationsMap(targetAssociations) || new Map<string, IfcClassificationReference>();
  sourceAssociationsMap.forEach((sourceAssociation, location) => {
    targetAssociationsMap.set(location, sourceAssociation);
  });
  return Array.from(targetAssociationsMap.values());
};

/**
 * Updates the properties of the target property set with the properties from the source property set.
 *
 * @param sourcePropertySet - The source property set containing properties to update.
 * @param targetPropertySet - The target property set to be updated.
 * @returns A new IfcPropertySet object with updated properties.
 */
const updateProperties = (sourcePropertySet: IfcPropertySet, targetPropertySet: IfcPropertySet): IfcPropertySet => {
  const targetPropertiesMap = new Map<string, IfcProperty | IfcPropertySingleValue | IfcPropertyEnumeratedValue>();

  // Build the targetPropertiesMap and update it with properties from the sourcePropertySet
  targetPropertySet.hasProperties.forEach((property) => {
    targetPropertiesMap.set(property.name, property);
  });

  sourcePropertySet.hasProperties.forEach((sourceProperty) => {
    const sourceValue = (sourceProperty as IfcPropertySingleValue).nominalValue?.value;
    if (sourceValue && sourceValue !== '...') {
      targetPropertiesMap.set(sourceProperty.name, sourceProperty);
    }
  });

  // Build the filteredProperties array
  const filteredProperties = Array.from(targetPropertiesMap.values()).filter((property) => {
    const value = (property as IfcPropertySingleValue).nominalValue;
    return (
      (value !== undefined && value !== null) ||
      ((property as IfcPropertyEnumeratedValue).enumerationValues?.length ?? 0) > 0
    );
  });

  return {
    ...targetPropertySet,
    hasProperties: filteredProperties,
  };
};

/**
 * Cleans the property sets by removing incorrect values.
 *
 * @param propertySets - An array of IfcPropertySet objects to be cleaned.
 * @returns A new array of cleaned IfcPropertySet objects.
 */
const cleanPropertySets = (propertySets: IfcPropertySet[]): IfcPropertySet[] => {
  return propertySets
    .map((propertySet) => {
      const cleanedProperties = propertySet.hasProperties.filter((property) => {
        switch (property.type) {
          case 'IfcPropertySingleValue':
            return property.nominalValue?.value !== null || property.nominalValue?.value !== '...';
          case 'IfcPropertyEnumeratedValue':
            return (property as IfcPropertyEnumeratedValue).enumerationValues || false;
          default:
            return false;
        }
      });

      return {
        ...propertySet,
        hasProperties: cleanedProperties,
      };
    })
    .filter((propertySet) => propertySet.hasProperties.length > 0);
};

/**
 * Updates the target property sets with the source property sets.
 *
 * This function takes a map of source property sets and an array of target property sets.
 * It updates the target property sets with the properties from the source property sets.
 * If a property set from the source does not exist in the target, it is added to the target.
 *
 * @param sourcePropertySetMap - A map where the keys are property set names and the values are the source property sets.
 * @param targetPropertySets - An array of target property sets that will be updated. This parameter can be undefined.
 * @returns An array of updated target property sets.
 */
const updatePropertySets = (
  sourcePropertySetMap: Map<string, IfcPropertySet>,
  targetPropertySets: IfcPropertySet[] | undefined,
): IfcPropertySet[] => {
  const targetPropertySetsMap = getPropertySetsMap(targetPropertySets) || new Map<string, IfcPropertySet>();
  sourcePropertySetMap.forEach((sourcePropertySet, name) => {
    const targetPropertySet = targetPropertySetsMap.get(name);
    if (targetPropertySet) {
      const updatedPropertySet = updateProperties(sourcePropertySet, targetPropertySet);
      targetPropertySetsMap.set(name, updatedPropertySet);
    } else {
      targetPropertySetsMap.set(name, sourcePropertySet);
    }
  });

  return Array.from(targetPropertySetsMap.values()).filter((propertySet) => propertySet.hasProperties.length > 0);
};

/**
 * Updates a list of target IFC entities with the attributes, associations, and property sets of a source IFC entity.
 *
 * @param sourceEntity - The source IFC entity whose attributes, associations, and property sets will be used for updating.
 * @param targetEntities - An array of target IFC entities to be updated.
 * @returns An array of updated IFC entities.
 */
export const updateEntitiesWithIfcEntity = (sourceEntity: IfcEntity, targetEntities: IfcEntity[]): IfcEntity[] => {
  const attributesToOverwrite: Partial<IfcEntity> = {};

  ATTRIBUTES.forEach((attribute) => {
    if (sourceEntity[attribute] && sourceEntity[attribute] !== '...') {
      attributesToOverwrite[attribute] = sourceEntity[attribute];
    }
  });

  return targetEntities.map((targetEntity) => {
    const updatedEntity: IfcEntity = { ...targetEntity, ...attributesToOverwrite };

    updatedEntity.isDefinedBy = cleanPropertySets(sourceEntity.isDefinedBy || []);
    updatedEntity.hasAssociations = sourceEntity.hasAssociations;

    return updatedEntity;
  });
};
