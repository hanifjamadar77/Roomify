import React from 'react';
import {Box} from "lucide-react";
import Button from "./ui/Button";

type NavbarProps = Partial<Pick<AuthContext, "isSignedIn" | "userName" | "signIn" | "signOut">>;

const Navbar = ({
    isSignedIn = false,
    userName = null,
    signIn = async () => false,
    signOut = async () => false,
}: NavbarProps) => {
    const handleAuthClick = async ()=>{
        if(isSignedIn){
            try {
                await signOut();
            }catch (e){
                console.error(`Puter sign out failed: ${e}` );
            }
            return;
        }

        try {
            await signIn();
        }catch (e){
            console.error(`Puter sign in failed: ${e}` );
        }
    };

    return (
        <header className="navbar">
           <div className="inner">
               <div className ="left">
                   <div className="brand">
                       <Box className="logo" />
                       <span className="name">Roomify</span>
                   </div>

                   <nav className="links">
                       <a href= "#">Product</a>
                       <a href= "#">Pricing</a>
                       <a href= "#">Community</a>
                       <a href= "#">Enterprise</a>
                   </nav>
               </div>

               <div className="actions">
                   {isSignedIn ? (
                       <>
                           <span className="greeting">
                               {userName ? `Hi, ${userName}` : "Signed In"}
                           </span>

                           <Button size={"sm"} onClick={handleAuthClick}>
                               Log Out
                           </Button>
                       </>
                   ) : (
                       <>
                       <Button
                           onClick={handleAuthClick}
                           size={"sm"} variant={"ghost"}
                       >
                           Log In
                       </Button>

                       <a href = "#upload"
                       className={"cta"}>
                   Get Started
               </a>
                       </>
                   )}
               </div>
           </div>

        </header>
    );
};

export default Navbar;
