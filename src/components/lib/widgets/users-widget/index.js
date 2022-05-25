import React, { Component} from "react";
import {Card, Form} from 'react-bootstrap';
import moment from "moment";

// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';

// Services Import
import { getUsers } from '../../../../services';

class UsersWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tableData:{count:0, data:[]},          
          filterStatus: false,
          filters: {name:"", email:"", role:""}
        };
    }

    componentDidMount() {
        this.updateTableData();        
    }

    componentDidUpdate() {        
        // console.log(this.state);
    }

    handleFilters= ()=> {
        this.updateTableData();
        
    }

    updateTableData = () => {
        const data = {
            filterStatus: this.state.filterStatus,
            filterByName: this.state.filters.name,
            filterByEmail: this.state.filters.email,
            filterByRole: this.state.filters.role
        };
        try {
            getUsers(data).subscribe({
            next: (response) => {
              if (                
                response?.success === true &&
                response?.data &&                
                Array.isArray(response?.data?.data)
              ) {                                  
                this.setState({ 
                    ...this.state,
                    tableData:{
                        count:response?.data?.count,
                        data:response?.data?.data
                    }
                 });
              }
            },
            error: (error) => {
              console.log(error)
            },
          });
        } catch (error) {
          console.error(error.message);
        }
    };

    render() {
        return(
            <React.Fragment>
                <Card className="mt-4 mx-2">                    
                    <Card.Body>
                        <Form>
                            <div className="row pt-2">
                                <div className="col-12 col-md-3 p-2">
                                    <TextField 
                                        id="outlined-name"
                                        label="filter by name"
                                        color="secondary" 
                                        focused
                                        onChange={(event)=> {
                                            this.setState({
                                                ...this.state,
                                                filterStatus: true,
                                                filters: {
                                                    ...this.state.filters,
                                                    name:event.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-md-3 p-2">
                                    <TextField 
                                        id="outlined-name"
                                        type="email"
                                        label="filter by email"
                                        color="secondary" 
                                        focused
                                        onChange={(event)=> {
                                            this.setState({
                                                ...this.state,
                                                filterStatus: true,
                                                filters: {
                                                    ...this.state.filters,
                                                    email:event.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-md-4 p-2">                                                                       
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        onChange={(event)=> {
                                            this.setState({
                                                ...this.state,
                                                filterStatus: true,
                                                filters: {
                                                    ...this.state.filters,
                                                    role:event.target.value==="All"?"":event.target.value
                                                }
                                            })
                                        }}
                                    >
                                        <FormControlLabel 
                                            value="Farmer" 
                                            control={<Radio color="secondary"/>} 
                                            label="Farmer" 
                                        />
                                        <FormControlLabel 
                                            value="Consumer" 
                                            control={<Radio color="secondary"/>} 
                                            label="Consumer" 
                                        />
                                        <FormControlLabel 
                                            value="All" 
                                            control={<Radio color="secondary"/>} 
                                            label="All" 
                                        />                                        
                                    </RadioGroup>
                                </div>
                                <div className="col-12 col-md-2 p-2">
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        onClick={this.updateTableData}
                                    >
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                <Card className="mt-4 mx-2 mb-4">
                    <Card.Body>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 420 }} aria-label="simple table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell align="left" sx={{ pl: 3 }}>User</TableCell>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Role</TableCell>
                                        <TableCell align="center">Joined</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.tableData?.count===0
                                    ?
                                    <TableRow
                                        key={"NODATA"}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell colSpan={5}>
                                            <Alert 
                                                variant="outlined" 
                                                severity="warning"
                                                sx={{ width: '100%' }}
                                            >
                                                No Data Available
                                            </Alert>
                                        </TableCell>
                                    </TableRow>
                                    :this.state.tableData.data.map((element)=> {
                                        return(
                                            <TableRow
                                                key={element._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                
                                                <TableCell align="center">
                                                    <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                                        {element.name[0]}
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell align="center">{element.name}</TableCell>
                                                <TableCell align="center">{element.email}</TableCell>
                                                <TableCell align="center">{element.role}</TableCell>
                                                <TableCell align="center">
                                                    {moment(element.createdAt).format("ll")}
                                                </TableCell>
                                            </TableRow>
                                        );                                        
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card.Body>
                </Card>
            </React.Fragment>   
            
        )
    }
}



export default UsersWidget;