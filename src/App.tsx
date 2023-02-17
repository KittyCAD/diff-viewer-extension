import { User_type } from "@kittycad/lib/dist/types/src/models";
import { Box, ThemeProvider } from "@primer/react";
import { useEffect, useState } from "react";
import { MessageIds, User } from "./chrome/types";
import { Loading } from "./components/Loading";
import { TokenForm } from "./components/TokenForm";
import { UserCard } from "./components/UserCard";

function App() {
  const [loading, setLoading] = useState(true);
  const [githubUser, setGithubUser] = useState<User>();
  const [kittycadUser, setKittycadUser] = useState<User_type>();

  async function fetchGithubUser() {
    try {
      const response = await chrome.runtime.sendMessage({ id: MessageIds.GetGithubUser })
      if (Object.keys(response).length === 0) throw Error("no response")
      const user = response as User
      setGithubUser(user)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setGithubUser(undefined)
    }
  }

  async function fetchKittycadUser() {
    try {
      const response = await chrome.runtime.sendMessage({ id: MessageIds.GetKittycadUser })
      if (Object.keys(response).length === 0) throw Error("no response")
      const user = response as User_type
      setKittycadUser(user)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setKittycadUser(undefined)
    }
  }

  async function onSignOut(id: MessageIds) {
    setLoading(true)
    await chrome.runtime.sendMessage({ id, data: { token: "" } })
    setLoading(false)
  }

  async function onToken(id: MessageIds, token: string) {
    const response = await chrome.runtime.sendMessage({ id, data: { token } })
    console.log(response)
  }

  useEffect(() => {
      fetchGithubUser()
      fetchKittycadUser()
  }, [])

  return (
    <ThemeProvider colorMode="auto">
      <Box backgroundColor="canvas.default" width={300} p={4}>
        {loading ? <Loading /> : (
          <Box>
            <Box>
              {githubUser ?
                <UserCard login={"@" + githubUser.login} avatar={githubUser.avatar_url}
                  onSignOut={async () => { await onSignOut(MessageIds.SaveGithubToken); setGithubUser(undefined) }} />
                :
                <TokenForm service="GitHub"
                  onToken={async (token) => { await onToken(MessageIds.SaveGithubToken, token); await fetchGithubUser() }} />
              }
            </Box>
            <Box mt={4}>
              {kittycadUser ?
                <UserCard login={kittycadUser.email} avatar={kittycadUser.image || "https://kittycad.io/logo-green.png"}
                  onSignOut={async () => { await onSignOut(MessageIds.SaveKittycadToken); setKittycadUser(undefined) }} />
                :
                <TokenForm service="KittyCAD"
                  onToken={async (token) => { await onToken(MessageIds.SaveKittycadToken, token); await fetchKittycadUser() }} />
              }
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App;
