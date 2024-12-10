import { useAuthStore } from "../../store/authUser"

export default function HomeScreen() {
  const { logout } = useAuthStore();
  return (
    <div>HomeScreen


      <button onClick={logout}>logout</button>
    </div>
  )
}
