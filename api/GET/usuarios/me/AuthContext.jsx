const { data } = await api.post("/auth/login", { email, password })
setAuthToken(data.token)
const me = await api.get("/usuarios/me") // ← NECESITA esta ruta
setUser(me.data)
