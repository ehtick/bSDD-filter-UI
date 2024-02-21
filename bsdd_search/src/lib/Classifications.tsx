import { useState, useEffect, Children } from 'react';
import { Form } from 'react-bootstrap';
import { Api, ClassificationContractV4, DomainContractV3, RequestParams } from './BsddApi';

interface Props {
  api: Api<unknown>;
  activeClassificationUri: string | undefined;
  classifications: ClassificationContractV4[];
  setClassifications: (value: ClassificationContractV4[]) => void;
  domains: { [id: string]: DomainContractV3 };
  accessToken: string;
}

function Classifications({
  api,
  activeClassificationUri,
  classifications,
  setClassifications,
  domains,
  accessToken,
}: Props) {
  const [classificationCount, setClassificationCount] = useState<number>(0);
  const [classificationUris, setClassificationUris] = useState<{
    [id: string]: Promise<ClassificationContractV4 | null>;
  }>({});
  const params: RequestParams = {
    headers: { Accept: 'text/plain' },
  };

  if (accessToken !== '') {
    params.headers = { ...params.headers, Authorization: 'Bearer ' + accessToken };
  }

  /**
   * Fetches a classification from the API and updates the state.
   *
   * @param {string} classificationUri - The URI of the classification to fetch.
   * @returns {Promise<ClassificationContractV4 | null>} - A promise that resolves to the fetched classification or null if the fetch fails.
   */
  function getClassification(classificationUri: string): Promise<ClassificationContractV4 | null> {
    const classificationPromise: Promise<ClassificationContractV4 | null> = new Promise(function (resolve) {
      const queryParameters = {
        namespaceUri: classificationUri,
        includeChildClassificationReferences: true,
      };
      resolve(
        api.api
          .classificationV4List(queryParameters, params)
          .then((response) => {
            if (response.status !== 200) {
              console.error(`API request failed with status ${response.status}`);
              return null;
            }
            return response.data;
          })
          .catch((err) => {
            console.error('Error fetching classification:', err);
            return null;
          }),
      );
    });
    setClassificationUris({
      ...classificationUris,
      classificationUri: classificationPromise,
    });
    return classificationPromise;
  }

  /**
   * Retrieves the name of the classification domain for a given classification.
   * @param classification The classification object.
   * @returns The name of the classification domain, or 'unknown' if not found.
   */
  function getClassificationDomainName(classification: ClassificationContractV4): string {
    if (classification && classification.domainNamespaceUri) {
      return domains[classification.domainNamespaceUri].name;
    }
    return 'unknown';
  }

  useEffect(() => {
    setClassificationCount(0);
    if (activeClassificationUri) {
      const initialClassificationUris: {
        [id: string]: Promise<ClassificationContractV4 | null>;
      } = {};
      if (activeClassificationUri) {
        initialClassificationUris[activeClassificationUri] = getClassification(activeClassificationUri);
      }
      setClassificationUris(initialClassificationUris);
    }
  }, [activeClassificationUri]);

  useEffect(() => {
    setClassificationCount(Object.keys(classificationUris).length);
    if (classificationCount === Object.keys(classificationUris).length) {
      return;
    }
    Promise.allSettled(Object.values(classificationUris)).then(function (results) {
      const r = results
        .map((result) => {
          if (result.status === 'fulfilled') {
            return result.value;
          }
          return null;
        })
        .filter((x): x is ClassificationContractV4 => x !== null);

      results.map((result) => {
        if (result.status === 'fulfilled') {
          const c = result.value;
          if (c && c.classificationRelations) {
            const extendedClassificationUris: {
              [id: string]: Promise<ClassificationContractV4 | null>;
            } = {
              ...classificationUris,
            };
            c.classificationRelations.forEach((classificationRelation) => {
              if (!(classificationRelation.relatedClassificationUri in Object.keys(classificationUris))) {
                extendedClassificationUris[classificationRelation.relatedClassificationUri] = getClassification(
                  classificationRelation.relatedClassificationUri,
                );
              }
            });
            setClassificationUris(extendedClassificationUris);
          }
        }
        return 'unknown';
      });
      setClassifications(r);
    });
  }, [classificationUris]);

  return (
    <div>
      {Children.toArray(
        classifications.map((classification, index) => (
          <Form.Group className="mb-3 row" key={index}>
            <Form.Label className="col-sm-5 col-form-label">{getClassificationDomainName(classification)}</Form.Label>
            <div className="col-sm-7">
              <Form.Control placeholder={classification.name} disabled />
            </div>
          </Form.Group>
        )),
      )}
    </div>
  );
}
export default Classifications;
