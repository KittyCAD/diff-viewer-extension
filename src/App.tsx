import { useEffect, useState } from "react";
import "./App.css";
import { Message, MessageIds, User } from "./chrome/types";
import { setStorageToken } from "./chrome/storage";

function TokenForm({ onToken }: { onToken: (token: string) => void }) {
  const [token, setToken] = useState("")

  return (
    <div className="p-6">
      <p className="text-lg font-medium">
        Enter a GitHub Token
      </p>
      <p>With `repo` permissions</p>
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
      <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={avatar} alt="Woman's Face" />
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <p className="text-lg text-black font-semibold">
            {name}
          </p>
          <p className="text-slate-500 font-medium">
            @{login}
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
  const [user, setUser] = useState<User>();

  async function fetchUser() {
    try {
      const user = await chrome.runtime.sendMessage<Message, User>({ id: MessageIds.GetGitHubUser })
      setUser(user)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      setUser(undefined)
    }
  }

  async function onSignOut() {
    setLoading(true)
    await setStorageToken("")
    setLoading(false)
  }

  async function onToken(token: string) {
    await setStorageToken(token)
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  })

  return (
    <div className="bg-slate-100 w-96 h-96">
      {loading ? null : (
        user ?
          <UserCard name={user.name} login={user.login} avatar={user.avatar_url} onSignOut={onSignOut} />
        : <TokenForm onToken={onToken} />
        )
      }
    </div>
  )
}

export default App;
