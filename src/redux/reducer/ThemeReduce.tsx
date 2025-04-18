
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
const ThemeReducer = createSlice({
    name: "Theme",
    initialState: true,
    reducers: {
        setTheme: {
            reducer: (state: boolean, action: PayloadAction<boolean>) => {
                return (state = action.payload)
            },
            prepare: (msg: boolean) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = ThemeReducer
export const { setTheme } = actions;

export default ThemeReducer