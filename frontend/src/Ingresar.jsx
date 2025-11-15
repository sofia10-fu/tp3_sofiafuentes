import { useState } from "react"
import { useAuth } from "./Auth"

export const Ingresar = () => {
  const { error, login } = useAuth()

  const [open, setOpen] = useState(false)
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(email, password)

    const result = await login(email, password)
    if (result.success) {
      setOpen(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>
      <dialog open={open}>
        <article>
          <h2>Ingrese su email y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input
                name="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <label htmlFor="password">Contraseña:</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  )
}
