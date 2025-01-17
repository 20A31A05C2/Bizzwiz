/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import ApiService from '../Apiservice';
import { ToastContainer, toast } from 'react-toastify';
import RingLoader  from "react-spinners/ClipLoader";


function Registerpage() {

    const [fname,setfname]=useState("");
    const [lname,setlname]=useState("");
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const [confirmpassword,setconfirmpassword]=useState("");
    const [check,setcheck]=useState(false);
    const [message,setmessage]=useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister=async(e)=>{
        e.preventDefault();

        try{
          setLoading(true);
        if(fname && lname && email && password && confirmpassword){
            if(password===confirmpassword){
                if(check===true)
                {
                    const data={fname,lname,email,password};
                    const response=await ApiService("/userregister","POST",data)

                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                    console.log(response.user); 
                    toast.success("Registered Successfully");
                }
                else{
                    
                    toast.error("Please accept the terms and conditions")
                    return
                }

            }
            else{
                toast.error("Passwords do not match")
                return
            
            }
        }
        else{
            
            toast.error("Please fill all the fields")
            return
        }
    }
        catch(error)
        {
            console.log(error);
            toast.error(error.message);
        }
        finally {
          setLoading(false);
        }
    }
        
    
    return (
        
        <div className="flex flex-col min-h-screen md:flex-row">
          
          <div className="w-full md:w-1/2 bg-[var(--primary-bg)] p-2 md:p-12 lg:p-10 flex items-center justify-center  md:min-h-screen">
            <div className="w-full max-w-md px-4 py-8 md:py-12">
              <div className="mb-10 md:mb-12">
                <h1 className="mb-2 text-2xl font-semibold text-white md:text-3xl">Create Account</h1>
                <p className="text-base text-gray-400 md:text-lg">
                  Enter your details to create your account
                </p>
              </div>
              
    
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm text-gray-400 md:text-base">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={fname}
                      onChange={(e) => setfname(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--primary-bg)] border border-gray-600 text-white custom-input focus:outline-none focus:border-[var(--accent-turquoise)]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-gray-400 md:text-base">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={lname}
                      onChange={(e) => setlname(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--primary-bg)] border border-gray-600 text-white custom-input focus:outline-none focus:border-[var(--accent-turquoise)]"
                    />
                  </div>
                </div>
    
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 md:text-base">Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--primary-bg)] border border-gray-600 text-white custom-input focus:outline-none focus:border-[var(--accent-turquoise)]"
                  />
                </div>
    
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 md:text-base">Password</label>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    
                    className="w-full p-3 rounded-xl bg-[var(--primary-bg)] border border-gray-600 text-white custom-input focus:outline-none focus:border-[var(--accent-turquoise)]"
                  />
                </div>
    
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 md:text-base">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--primary-bg)] border border-gray-600 text-white custom-input focus:outline-none focus:border-[var(--accent-turquoise)]"
                  />
                </div>
    
                <div className="flex items-center py-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={check}
                    onChange={(e) => setcheck(!check)}
                    className="w-5 h-5 border-gray-600 rounded custom-checkbox"

                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-400 md:text-base">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
    
                <button type='submit' className="w-full bg-[var(--accent-turquoise)] text-black font-medium p-3 rounded-xl hover:bg-[var(--accent-turquoise-hover)] transition-colors text-lg">
                {loading ? (
                  <RingLoader
                  />
                ) : (
                  "Create Account"
                )}
                </button>
    
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-4 text-gray-400 bg-[var(--primary-bg)]">or register with</span>
                  </div>
                </div>
    
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button className="flex items-center justify-center gap-3 p-3 border border-gray-600 rounded-xl text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <FcGoogle className="w-6 h-6" />
                    <span className="text-base">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 p-3 border border-gray-600 rounded-xl text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <FaApple className="w-6 h-6" />
                    <span className="text-base">Apple</span>
                  </button>
                </div>
    
                <p className="mt-8 text-base text-center text-gray-400">
                  Already have an account?{' '}
                  <a href="/userlogin" className="text-[var(--accent-turquoise)] hover:underline">
                    Sign In
                  </a>
                </p>
              </form>
            </div>
          </div>
          <div className="hidden w-1/2 bg-black md:block"></div>
          <ToastContainer />
        </div>
        
    );
}

export default Registerpage