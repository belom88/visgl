import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LayerPropsEdited, PopoverId } from '../../types';
import { DimensionMode } from '@belom88/deckgl-vehicle-layer';

export const LAYER_PROPS_FEATURE_KEY = 'layerProps';

export type LayerPropsState = LayerPropsEdited;

export const initialLayerPropsState: LayerPropsState = {
  vehiclesCountValue: 2000,
  vehiclesCountMinMax: [10, 10000],
  animated: true,
  scale: 10,
  dimensionMode: '3D',
};

export const layerPropsSlice = createSlice({
  name: LAYER_PROPS_FEATURE_KEY,
  initialState: initialLayerPropsState,
  reducers: {
    setVehiclesCount: (
      state: LayerPropsState,
      action: PayloadAction<number>
    ) => {
      state.vehiclesCountValue = action.payload;
    },
    toggleAnimation: (state: LayerPropsState) => {
      state.animated = !state.animated;
      if (state.animated) {
        state.vehiclesCountValue = 2000;
        state.vehiclesCountMinMax = [10, 10000];
      } else {
        state.vehiclesCountMinMax = [1000, 100000];
        state.vehiclesCountValue = 10000;
      }
    },
    setAnimation: (state: LayerPropsState, action: PayloadAction<boolean>) => {
      state.animated = action.payload;
      if (state.animated) {
        state.vehiclesCountValue = 2000;
        state.vehiclesCountMinMax = [10, 10000];
      } else {
        state.vehiclesCountMinMax = [1000, 100000];
        state.vehiclesCountValue = 10000;
      }
    },
    setScale: (state: LayerPropsState, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    toggleDimensionMode: (state: LayerPropsState) => {
      state.dimensionMode = state.dimensionMode === '2D' ? '3D' : '2D';
    },
    setDimensionMode: (
      state: LayerPropsState,
      action: PayloadAction<DimensionMode>
    ) => {
      state.dimensionMode = action.payload;
    },
    setVehicleColor: (
      state: LayerPropsState,
      action: PayloadAction<{
        popoverId: PopoverId;
        color: [number, number, number];
      }>
    ) => {
      switch (action.payload.popoverId) {
        case PopoverId.VEHICLE_LAYER_3D_COLOR:
          state.color3D = action.payload.color;
          break;
        case PopoverId.VEHICLE_LAYER_2D_FOREGROUND:
          state.foregroundColor2d = action.payload.color;
          break;
        case PopoverId.VEHICLE_LAYER_2D_BACKGROUND:
          state.backgroundColor2d = action.payload.color;
          break;
        case PopoverId.VEHICLE_LAYER_COMMON_COLOR:
        default:
          state.commonColor = action.payload.color;
      }
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const layerPropsReducer = layerPropsSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(layerPropsActions.setVehiclesCount(1000))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const layerPropsActions = layerPropsSlice.actions;

export const selectVehiclesCountValue = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountValue,
  (result) => result
);
export const selectVehiclesCountMinMax = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountMinMax,
  (result) => result
);
export const selectAnimationState = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].animated,
  (result) => result
);
export const selectScale = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].scale,
  (result) => result
);
export const selectDimensionMode = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].dimensionMode,
  (result) => result
);

export const selectVehicleColor = createSelector<
  [
    (state: RootState) => LayerPropsState,
    (state: RootState, popoverId: PopoverId) => PopoverId
  ],
  [number, number, number] | undefined
>(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY],
  (state: RootState, popoverId: PopoverId) => popoverId,
  (layerPropsState, popoverId): [number, number, number] | undefined => {
    switch (popoverId) {
      case PopoverId.VEHICLE_LAYER_3D_COLOR:
        return layerPropsState.color3D;
      case PopoverId.VEHICLE_LAYER_2D_FOREGROUND:
        return layerPropsState.foregroundColor2d;
      case PopoverId.VEHICLE_LAYER_2D_BACKGROUND:
        return layerPropsState.backgroundColor2d;
      case PopoverId.VEHICLE_LAYER_COMMON_COLOR:
      default:
        return layerPropsState.commonColor;
    }
  }
);
export const selectAllColors = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY],
  (result) => [
    result.commonColor,
    result.foregroundColor2d,
    result.backgroundColor2d,
    result.color3D,
  ]
);
