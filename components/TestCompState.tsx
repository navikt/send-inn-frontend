import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useState, useContext, createContext } from 'react';
import { AppContext } from "../pages/dokumentinnsending/opprettSoknadResource"


// https://fettblog.eu/typescript-react/context/



function TestCompState() {
    /*
    const theme = useContext(ThemeContext);

    OLD:

       <AppContext.Consumer>
        {
            ({authenticated}) => {
                if(authenticated) {
                    return <h1>Logged in!</h1>
                }
                return <h1>You need to sign in</h1>
            }
        }
    </AppContext.Consumer>

    */

    const appContext = useContext(AppContext)
    return (
                <h1>Vedleggsnr: {appContext.vedleggsnr}</h1>

    )
}
export default TestCompState;
