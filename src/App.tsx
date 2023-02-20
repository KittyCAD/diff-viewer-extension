import { Box, ThemeProvider } from "@primer/react";
import { useEffect, useState } from "react";
import { KittycadUser, MessageIds, User } from "./chrome/types";
import { TokenForm } from "./components/TokenForm";
import { UserCard } from "./components/UserCard";

function App() {
  const [githubUser, setGithubUser] = useState<User>();
  const [kittycadUser, setKittycadUser] = useState<KittycadUser>();

  async function fetchGithubUser() {
    try {
      const response = await chrome.runtime.sendMessage({ id: MessageIds.GetGithubUser })
      if (Object.keys(response).length === 0) throw Error("no response")
      const user = response as User
      setGithubUser(user)
    } catch (e) {
      console.error(e)
      setGithubUser(undefined)
    }
  }

  async function fetchKittycadUser() {
    try {
      const response = await chrome.runtime.sendMessage({ id: MessageIds.GetKittycadUser })
      if (Object.keys(response).length === 0) throw Error("no response")
      const user = response as KittycadUser
      setKittycadUser(user)
    } catch (e) {
      console.error(e)
      setKittycadUser(undefined)
    }
  }

  async function onToken(id: MessageIds, token: string) {
    await chrome.runtime.sendMessage({ id, data: { token } })
  }

  useEffect(() => {
    fetchGithubUser()
    fetchKittycadUser()
  }, [])

  return (
    <ThemeProvider colorMode="auto">
      <Box backgroundColor="canvas.default" width={300} p={4}>
        <Box>
          {githubUser ?
            <UserCard login={"@" + githubUser.login} avatar={githubUser.avatar_url}
              onSignOut={async () => { await onToken(MessageIds.SaveGithubToken, ""); setGithubUser(undefined) }} />
            :
            <TokenForm service="GitHub"
              onToken={async (token) => { await onToken(MessageIds.SaveGithubToken, token); await fetchGithubUser() }} />
          }
        </Box>
        <Box mt={4}>
          {kittycadUser ?
            <UserCard login={kittycadUser.email} avatar={kittycadUser.image || "https://kittycad.io/logo-green.png"}
              onSignOut={async () => { await onToken(MessageIds.SaveKittycadToken, ""); setKittycadUser(undefined) }} />
            :
            <TokenForm service="KittyCAD"
              onToken={async (token) => { await onToken(MessageIds.SaveKittycadToken, token); await fetchKittycadUser() }} />
          }
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App;
