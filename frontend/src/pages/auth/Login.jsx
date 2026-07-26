import AuthForm from "../../components/AuthForm"

export default function Login() {
    
  return(
        <>
        <div className="form-area">
            <h2>Log In To Continue</h2>
            <AuthForm endpoint={`${import.meta.env.VITE_API_URL}/api/user/customer/login`} />
        </div>
        </>
  )
}
