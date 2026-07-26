import AuthForm from "../../components/AuthForm"

export default function AdminLogin() {
    
  return(
        <>
        <div className="form-area">
            <h2>Sign Up To Continue</h2>
            <AuthForm endpoint={`${import.meta.env.VITE_API_URL}/api/user/login`} fr='admin'/>
        </div>
        </>
  )
}
