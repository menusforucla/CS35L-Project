"use client";

import Router from 'next/router'
import React from "react";


export const BackButton: React.FC=()=> {
    return (
        <div onClick={() => Router.back()}>Go Back</div>
    );
}