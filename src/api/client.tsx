import axios from "axios"

export type BodyType = {
    archive: string,
    id?: string,
    slug?: string,
    search?: string,
    category?: string,
    skip?: number,
    limit?: number,
    sort?: string,
    update?: number,
}

export const ApiLogin = async (body: { username: string, password: string }) => {
    const result = await axios.post("/api/login", body, {
        withCredentials: true
    })
    return result.data
}
export const ApiLogout = async () => {
    const result = await axios.post("/api/logout", null, {
        withCredentials: true
    })
    return result.data
}
export const ApiSignup = async (body: { username: string, password: string, email: string }) => {
    const result = await axios.post("/api/signup", body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return result.data
}
export const ApiItem = async ({ archive, search, id, slug, category, sort, skip, limit }: BodyType) => {
    try {
        const result = await axios.get("/api/" +
            archive +
            "?archive=" + archive +
            "&search=" + `${search ? search : ""}` +
            "&id=" + `${id ? id : ""}` +
            "&slug=" + `${slug ? slug : ""}` +
            "&category=" + `${category ? category : ""}` +
            "&skip=" + `${skip ? skip : ""}` +
            "&sort=" + `${sort ? sort : ""}` +
            "&limit=" + `${limit ? limit : ""}`
        )
        return result.data
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}