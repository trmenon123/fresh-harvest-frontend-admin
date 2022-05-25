import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { 
    Admin, 
    Gate,
    LedgerWidget,
    UsersWidget,
    SurplusWidget,
    HomeWidget,
    ChatWidget 
} from "../lib";
// Components
// Components CSS

function FreshHarvest(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Gate/> }/>
                <Route path="/admin" element={<Admin/>}>
                    <Route path="ledger" element={<LedgerWidget/>}/>
                    <Route path="home" element={<HomeWidget/>}/>
                    <Route path="mail" element={<ChatWidget/>}/>
                    <Route path="manage-users" element={<UsersWidget/>}/>
                    <Route path="manage-surplus" element={<SurplusWidget/>}/>
                </Route>
                <Route path="/test" element={<h2>Test</h2>}/>
            </Routes>        
        </BrowserRouter>
    );
}


export default FreshHarvest;