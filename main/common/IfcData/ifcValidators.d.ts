import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../app/store';
import { BsddDictionary } from './bsddBridgeData';
import { IfcClassificationReference } from './ifc';
type ValidationState = 'valid' | 'invalid' | 'fixed';
type ValidationResult = {
    ifcClassificationReference: IfcClassificationReference;
    validationState: ValidationState;
    message: string | null;
};
/**
 * Patches the IfcClassificationReference by setting the location and other properties based on the referenced source.
 * @param ifcClassificationReference - The IfcClassificationReference object to be patched.
 * @param dispatch - The dispatch function from the Redux Thunk middleware.
 * @param state - The RootState object from the Redux store.
 * @returns A Promise that resolves to a ValidationResult object.
 */
export declare function patchIfcClassificationReference(ifcClassificationReference: IfcClassificationReference, dispatch: ThunkDispatch<unknown, unknown, UnknownAction>, state: RootState): Promise<ValidationResult>;
/**
 * Validates the bsddDictionary IfcClassification. If valid, returns a new object with parameterMapping and IfcClassification.
 * If the bsddDictionary or the ifcClassification location is null, returns null.
 *
 * @param state - The RootState object.
 * @param bsddDictionary - The BsddDictionary object to validate.
 * @returns A new BsddDictionary object or null.
 */
export declare function validateDictionary(state: RootState, dispatch: AppDispatch, bsddDictionary: BsddDictionary | null): Promise<BsddDictionary | null>;
export {};
