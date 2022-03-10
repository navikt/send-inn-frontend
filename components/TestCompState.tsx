import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useState, useContext, createContext } from 'react';
import { AppContext } from '../pages/dokumentinnsending/opprettSoknadResource';

// https://fettblog.eu/typescript-react/context/

function VedleggState() {
    const appContext = useContext(AppContext);
    return <h1>Vedleggsnr: {appContext && appContext.vedleggsnr}</h1>;
}
export default VedleggState;
