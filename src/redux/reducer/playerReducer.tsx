
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
export type PlayerType = {
    src: string,
}
const PlayerReducer = createSlice({
    name: "Player",
    initialState: { src: "" },
    reducers: {
        setPlayer: {
            reducer: (state: PlayerType, action: PayloadAction<PlayerType>) => {
                return (state = action.payload)
            },
            prepare: (msg: PlayerType) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = PlayerReducer
export const { setPlayer } = actions;

export default PlayerReducer