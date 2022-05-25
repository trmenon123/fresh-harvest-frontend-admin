import React, {useState} from "react";
import { useNavigate  } from "react-router-dom";
import {signin, signout} from '../../../services';
import { authenticateUser, signoutUser } from "../../../authentication";
import { NavigationBar} from '../../common';
import {Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import {
    Form,
    Button
} from 'react-bootstrap';


function Gate(){
    // Handling prelim inits
    const clearInit = async()=> {
        signoutUser();
        signout().subscribe({
            next: (data)=> {
                console.log(data);
                if(data?.success === true) {
                    console.log("Signout api acheived");
                }
            },
            error: (error)=> {
                console.log("ERROR");
                console.log(error);
            }
        });
    }
    // Clearing cookie, localstorage and session
    clearInit();
    console.log(localStorage);
    const navigate = useNavigate();
    const [passInput, setPassInput]= useState("");

    

    const handleFormSubmit = async(e)=> {
        e.preventDefault();
        const formData = {
            email: "admin@freshHarvest.com",
            password: passInput
        };
        signin(formData).subscribe({
            next: (data)=> {
                console.log(data);
                if(data?.success === true) {
                    const authData = {
                        token : data?.token,
                        user : data?.data
                    };
                    const auth = authenticateUser(authData);
                    if(auth === true) {
                        navigate("/admin/home");
                    }
                }else {
                    alert(data?.message);
                }
            },
            error: (error)=> {
                console.log("ERROR");
                console.log(error);
            }
        });
    }
    return (
        <React.Fragment>
            <NavigationBar showControls={false}/>
            <Card bg="light" border="dark" style={{ width: '32rem' }} className="mx-auto my-4">
                <Card.Title className="p-4 "> 
                    <div className="m-4 row border-bottom border-dark">
                        <div className="p-4">
                            <FontAwesomeIcon icon={faKey} className="fa-5x"/>
                        </div>                        
                    </div>                    
                </Card.Title>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                size="lg" 
                                type="text" 
                                defaultValue="master"
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                size="lg" 
                                type="password" 
                                placeholder="Password" 
                                onChange={(e)=> {
                                    setPassInput(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            onClick={handleFormSubmit}
                        >
                            Login
                        </Button>
                    </Form>                    
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default Gate;