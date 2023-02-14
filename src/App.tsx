import { User_type } from "@kittycad/lib/dist/types/src/models";
import { useEffect, useState } from "react";
import "./App.css";
import { MessageIds, User } from "./chrome/types";

function TokenForm({ service, onToken }: { service: string, onToken: (token: string) => void }) {
  const [token, setToken] = useState("")

  return (
    <div className="p-6">
      <p className="text-lg font-medium">
        Enter a {service} Token
      </p>
      {service === "GitHub" &&
      <p>With `repo` permissions</p>
      }
      <div className="py-2">
        <input value={token} onChange={(e) => setToken(e.target.value)} type="text"></input>
      </div>
      <button className="px-4 py-1 text-sm text-grey-600 font-semibold border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent"
              onClick={() => onToken(token)}>Save</button>
    </div>
  )
}

function UserCard({ login, avatar, name, onSignOut }: { login: string, avatar: string, name: string | undefined | null, onSignOut: () => void }) {
  return (
    <div className="py-8 px-8 max-w-sm mx-auto space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
      {avatar &&
      <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={avatar} alt="Woman's Face" />
      }
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <p className="text-lg text-black font-semibold">
            {name || "KittyCAD"}
          </p>
          <p className="text-slate-500 font-medium">
            {login}
          </p>
        </div>
        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  )
}

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
    await chrome.runtime.sendMessage({ id, data: { token: "" }})
    setLoading(false)
  }

  async function onToken(id: MessageIds, token: string) {
    const response = await chrome.runtime.sendMessage({ id, data: { token }})
    console.log(response)
  }

  useEffect(() => {
    fetchGithubUser()
    fetchKittycadUser()
  }, [])

  return (
    <div className="bg-slate-100 w-96 h-96">
      {loading ? null : (
        <div>
          {
          githubUser ?
          <UserCard name={githubUser.name} login={"@" + githubUser.login} avatar={githubUser.avatar_url}
                    onSignOut={async () => { await onSignOut(MessageIds.SaveGithubToken); setGithubUser(undefined) }} />
        : <TokenForm service="GitHub"
                     onToken={async (token) => { await onToken(MessageIds.SaveGithubToken, token); await fetchGithubUser() }} />
          }
          {
          kittycadUser ?
          <UserCard name={kittycadUser.name} login={kittycadUser.email} avatar={kittycadUser.image}
                    onSignOut={async () => { await onSignOut(MessageIds.SaveKittycadToken); setKittycadUser(undefined) }} />
        : <TokenForm service="KittyCAD"
                     onToken={async (token) => { await onToken(MessageIds.SaveKittycadToken, token); await fetchKittycadUser() }} />
          }
        </div>
      )}
    </div>
  )
}

export default App;
