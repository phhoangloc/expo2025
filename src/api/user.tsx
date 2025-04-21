import axios from "axios"


export type BodyTypeWithPosition = {
    position: string,
    archive?: string,
    archivePlus?: string,
    id?: number,
    slug?: string,
    hostId?: number,
    search?: string,
    skip?: number,
    limit?: number,
    sort?: string,
    update?: number,
    file?: File
}
export const ApiCheckLogin = async () => {
    try {
        const result = await axios.get("/api/user", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage && localStorage.token
            },
        })
        return (result.data)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        try {
            const result = await axios.get("/api/admin", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage && localStorage.token
                },
            })
            return (result.data)
        } catch (error) {
            console.log(error)
            return ({ success: false })
        }

    }

}

export const ApiItemUser = async ({ position, archive, archivePlus, hostId, search, id, slug, sort, skip, limit }: BodyTypeWithPosition) => {
    try {
        const result = await axios.get("/api/" + position +
            "/" + archive +
            "?archive=" + `${archivePlus ? archivePlus : archive}` +
            "&hostId=" + `${hostId ? hostId : ""}` +
            "&search=" + `${search ? search : ""}` +
            "&id=" + `${id ? id : ""}` +
            "&slug=" + `${slug ? slug : ""}` +
            "&skip=" + `${skip ? skip : ""}` +
            "&sort=" + `${sort ? sort : ""}` +
            "&limit=" + `${limit ? limit : ""}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage && localStorage.token
                },
                withCredentials: true
            }
        )
        return result.data
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiCreateItem = async ({ position, archive }: BodyTypeWithPosition, body: any) => {
    const result = await axios.post("/api/" +
        position +
        "/" + archive,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage && localStorage.token
            },
            withCredentials: true
        })
    return (result.data)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiUpdateItem = async ({ position, archive, id }: BodyTypeWithPosition, body: any) => {
    const result = await axios.put("/api/" +
        position +
        "/" + archive +
        "?id=" + id,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage && localStorage.token
            },
            withCredentials: true
        })
    return (result.data)
}
export const ApiDeleteItem = async ({ position, archive, id }: BodyTypeWithPosition) => {
    const result = await axios.delete("/api/" +
        position +
        "/" + archive +
        "?id=" + id,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage && localStorage.token
            },
            withCredentials: true
        })
    return (result.data)
}

export const ApiUploadFile = async ({ position, archive, file }: BodyTypeWithPosition) => {
    const formData = new FormData()
    if (file) {
        formData.append("file", file)
        const fileUpload = await axios.post("/api/" + position + "/" + archive, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.token,

            },
            withCredentials: true
        })
        return fileUpload.data
    }

}