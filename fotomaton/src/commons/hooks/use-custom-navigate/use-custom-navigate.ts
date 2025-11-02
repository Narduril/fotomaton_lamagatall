import { useNavigate } from "react-router-dom"

const useCustomNavigate = () => {
  const navigate = useNavigate()

  const customNavigate = (to: string) => {
    if (!document.startViewTransition) {
      navigate(to)
    } else {
      document.startViewTransition(() => navigate(to))
    }
  }

  return { customNavigate }
}

export default useCustomNavigate