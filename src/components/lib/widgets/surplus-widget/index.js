import React, { Component} from "react";
import config from '../../../../constants/config.json';
import {Card, Form} from 'react-bootstrap';
import moment from "moment";

// Material UI imports
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Slider from '@mui/material/Slider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import { amber } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import NotInterestedIcon from '@mui/icons-material/NotInterested';


// Services import
import { createSurplus, getSurplusDetails, getSurplusStockDetails } from '../../../../services';

class SurplusWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:{count:0, data:[]},   
            stockLib: [],       
            filterStatus: false,
            filters: {name:"", type:""},
            modalStatus: false,
            createForm: {
                response: {
                    open: false,
                    message: "",
                },
                snapshot: {
                    surplusName: "",
                    surplusType: ""
                }                
            },
            errorStatus: false,
            errorType:"",
            errorMessage: "",
            farmDetailsModal: {open: false, meta: {}, data: {}}
        };        
    }

    componentDidMount() {
        this.updateTableData();
    }

    componentDidUpdate() {    
        console.log("Updated");    
        console.log(this.state);
    }

    updateTableData = () => {
        const data = {
            filterStatus: this.state.filterStatus,
            filterByName: this.state.filters.name,
            filterByType: this.state.filters.type,
        };
        try {
            getSurplusDetails(data).subscribe({
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
                 }, ()=> {
                    this.createStockLib();
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

    createStockLib = ()=> {       
        console.log("Called"); 
        try {
            this.state.tableData.data.forEach((element)=> {
                getSurplusStockDetails(element._id).subscribe({
                    next: (response)=> {
                        if(response.success === true) {
                            // console.log(response.data);
                            this.setState({
                                ...this.state,
                                stockLib: [
                                    ...this.state.stockLib,
                                    {
                                        surplusId: response?.request,
                                        data: response?.data
                                    }
                                ]
                            })
                        }
                    },
                    error: (error)=> {
                        console.log("[ERROR] api error populate stock library");
                        console.log(error);
                    },
                })
            })
        }catch(err) {
            console.log("[ERROR] Trying to create stock dictionary");
            console.log(err);
        }
    }

    toggleModal = ()=> {
        const newStatus = this.state.modalStatus === true? false: true;
        this.setState({
            ...this.state, 
            modalStatus: newStatus,
            createForm: {
                ...this.state.createForm,
                snapshot: {
                    surplusName: "",
                    surplusType: ""
                }
            },
            errorStatus: false,
            errorType:"",
            errorMessage: ""
        })
    }

    validateCreateForm = ()=> {
        if(
            this.state.createForm.snapshot.surplusName === "" ||
            this.state.createForm.snapshot.surplusType === ""
        ) {            
            this.setState({
                ...this.state, 
                errorMessage: "Please enter valid entries",
                errorStatus: true,
                errorType: "error" 
            });
        }else {
            this.setState({...this.state, errorMessage: false});
            this.createFormSubmitDriver();
        }
    }

    createFormSubmitDriver = () => {
        const postData = {
            surplusName: this.state.createForm.snapshot.surplusName.toUpperCase(),
            surplusType: this.state.createForm.snapshot.surplusType,
        };
        try {
            createSurplus(postData).subscribe({
            next: (response) => {
                if (response?.success === true) {
                    if(response?.status === false) {
                        this.setState({
                            ...this.state,
                            errorMessage: response.message,
                            errorStatus: true,
                            errorType: "warning" 
                        }) 
                    }else {
                        this.setState({
                            ...this.state,
                            createForm: {
                                ...this.state.createForm,
                                response: {
                                    open: true,
                                    message: response.message,
                                }
                            }                            
                        });
                        this.updateTableData();
                        this.toggleModal();
                    }
                }
            },
            error: (error) => {
              console.log(error)
            },
          });
        } catch (error) {
          console.error(error.message);
        }        
    }

    handleSnackbarClose= ()=> {
        this.setState({
            ...this.state,
            createForm: {
                ...this.state.createForm,
                response: {
                    open: false,
                    message: ""
                }
            }
        });
    }

    handleSlider = (event)=> {
        const value = event.target.value;
        const surplusTypesList = config?.serviceDictionary?.surplus?.types;
        const currentObj = surplusTypesList.find((e)=> e.value === value);
        // const currentObj = this.state.sliderRef.find((e)=> e.value === value);
        this.setState({
            ...this.state,
            filterStatus: true,
            filters: {
                ...this.state.filters,
                type: currentObj.reference === "all"? "":currentObj.reference 
            }
        });
        console.log(this.state);        
    }

    handleViewFarm= (surplusId)=> {
        const surplus = this.state.stockLib.find((element)=> {
            return element.surplusId === surplusId
        });
        const surplusData = this.state.tableData.data.find((element)=> {
            return element._id === surplusId
        })
        this.setState({
            ...this.state,
            farmDetailsModal: {
                ...this.state.farmDetailsModal,
                open: true,
                meta: surplusData,
                data: surplus
            }
        });
    }

    handleCloseFarmDetailsModal= ()=> {
        this.setState({
            ...this.state,
            farmDetailsModal: {
                ...this.state.farmDetailsModal,
                open: false,
                meta: {},
                data: {}
            }
        });
    }

       

    render() {
        return(
            <React.Fragment>
                {/* Farm details Modal */}
                <Dialog
                    open={this.state.farmDetailsModal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'left'}}
                    keepMounted
                    scroll="paper"
                    fullWidth
                    onClose={this.handleCloseFarmDetailsModal}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>                                                
                        {this.state.farmDetailsModal.open === true?
                            `${this.state.farmDetailsModal.meta.name} Stock Report`
                            :
                            "No Fruit Selected"
                        }  
                    </DialogTitle>
                    <Divider/>
                    <DialogContent>
                        {this.state.farmDetailsModal.open === true?
                            <List sx={{ width: 'auto', }}>
                                {this.state.farmDetailsModal.data.data.length === 0?
                                    <ListItem key='EMPTYSET' sx={{border: '1px solid #ececec', my: 1}}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <NotInterestedIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary="No farms"
                                        />
                                    </ListItem>
                                    :
                                    this.state.farmDetailsModal.data.data.map((element)=> {
                                        return(
                                            <ListItem 
                                                key={element._id}
                                                sx={{border: '1px solid #ececec', my: 1}}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: amber[800] }}>
                                                        {element?.farmId?.name[0]}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={element?.farmId?.name}
                                                    secondary={element?.farmId?.owner?.name}
                                                />
                                                <ListItemText 
                                                    primary={`${element?.stock} in stock`}
                                                    secondary={`@Rs.${element?.unitPrice}`}
                                                />
                                            </ListItem>
                                        )
                                    })
                                    
                                }      
                            </List>
                            :
                            "No Fruit Selected"
                        }                        
                    </DialogContent>
                </Dialog>


                <IconButton  
                    color="primary" 
                    aria-label="add"
                    onClick={this.toggleModal}
                    sx={{ display: 'flex' }}
                >
                    <AddIcon />
                </IconButton >
                <Dialog 
                    open={this.state.modalStatus}
                    onClose={this.toggleModal}                    
                >
                    <Paper elevation={24} className="p-4" sx={{ width: 500 }}>
                        <DialogTitle>Create Surplus</DialogTitle>
                        <Divider variant="middle" color="secondary"/>
                        <Form className="mt-4">
                            <TextField 
                                id="outlined-basic" 
                                label="Surplus name" 
                                variant="outlined" 
                                color="secondary"
                                defaultValue=""
                                sx={{ width: '100%', marginTop: 2 }} 
                                focused
                                onChange={(event)=> {
                                    this.setState({
                                        ...this.state,
                                        createForm: {
                                            ...this.state.createForm,
                                            snapshot: {
                                                ...this.state.createForm.snapshot,
                                                surplusName: event.target.value
                                            }
                                        }
                                    })
                                }}
                            />
                            <InputLabel 
                                id="demo-simple-select-label"
                                sx={{ marginTop: 2, color: 'secondary.main' }}
                            >
                                Surplus type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                color="secondary"
                                label="Surplus type"
                                defaultValue=""
                                value={this.state.createForm.snapshot.surplusType}                                
                                sx={{ width: '100%', color: 'secondary.main' }}
                                required
                                onChange={(event)=> {
                                    this.setState({
                                        ...this.state,
                                        createForm: {
                                            ...this.state.createForm,
                                            snapshot: {
                                                ...this.state.createForm.snapshot,
                                                surplusType: event.target.value
                                            }
                                        }
                                    })
                                }}
                            >
                                <MenuItem value={"vegetable"}>Vegetable</MenuItem>
                                <MenuItem value={"fruit"}>Fruit</MenuItem>
                                <MenuItem value={"pulses"}>Pulses</MenuItem>
                                <MenuItem value={"grain"}>Grain</MenuItem>
                            </Select>
                            {this.state.errorStatus === true?
                                <Alert 
                                    severity="error"
                                    sx={{ width: '100%'}}
                                >
                                    {this.state.errorMessage}
                                </Alert>
                                :""
                            }                            
                            <Button 
                                variant="contained"
                                color="secondary"
                                sx={{ width: '100%', marginTop: 2 }}
                                onClick={this.validateCreateForm}
                            >
                                Create
                            </Button>
                        </Form>
                    </Paper>                                       
                </Dialog>
                {/* Snackbar */}
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={this.state.createForm.response.open}
                    onClose={this.handleSnackbarClose}
                    message={this.state.createForm.response.message}
                />
                <Divider variant="middle" />


                <Card className="mt-4 mx-2" sx={{width: 'auto'}}>
                    <Card.Body>
                        <Form>
                            <div className="row pt-2 d-flex justify-content-start">
                                <div className="col-12 col-sm-12 col-md-4 p-2">
                                    <TextField 
                                        id="outlined-name"
                                        label="filter by name"
                                        color="secondary"
                                        sx={{ width: '100%',color: 'secondary.main' }} 
                                        focused
                                        onChange={(event)=> {
                                            this.setState({
                                                ...this.state,
                                                filterStatus: true,
                                                filters: {
                                                    ...this.state.filters,
                                                    name:event.target.value.toUpperCase()
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-sm-12 col-md-6 p-2">
                                    <InputLabel 
                                        id="demo-simple-select-label"
                                        sx={{ color: 'secondary.main' }}
                                    >
                                        Filter by surplus type
                                    </InputLabel>
                                    <Slider
                                        track="inverted"
                                        aria-labelledby="track-inverted-slider"
                                        color="secondary"
                                        defaultValue={0}
                                        step={25}
                                        sx={{ width: '75%' }}
                                        marks={config?.serviceDictionary?.surplus?.types}
                                        onChange={(event)=> {this.handleSlider(event)}}
                                    />
                                </div>
                                <div className="col-12 col-sm-12 col-md-2 p-2">
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        sx={{ color: 'secondary.main' }}
                                        size="large"
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
                        <TableContainer component={Paper} sx={{width: '100%'}}>
                            <Table sx={{ width: 'inherit' }} aria-label="simple table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell align="left">Surplus</TableCell>
                                        <TableCell align="left">Type</TableCell>
                                        <TableCell align="left">Stock</TableCell>
                                        <TableCell align="left">Farms</TableCell>
                                        <TableCell align="left">Created</TableCell>
                                        <TableCell align="left">Updated</TableCell>
                                        <TableCell align="left">View</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.tableData.count === 0?
                                        <TableRow
                                            key={"NODATA"}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell colSpan={7}>
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
                                                    <TableCell align="left">
                                                        <Stack direction="row" spacing={1}>
                                                            <Avatar sx={{ bgcolor: amber[800] }}>
                                                                {element.name[0]}
                                                            </Avatar>
                                                            <Typography sx={{display: 'flex', alignItems: 'center'}}>
                                                                {element.name.toUpperCase()}
                                                            </Typography>
                                                        </Stack>                                                        
                                                    </TableCell>
                                                    <TableCell align="left">{element.type.toUpperCase()}</TableCell>
                                                    <TableCell align="left">
                                                        {this.state.stockLib.find((lib)=> {
                                                            return lib.surplusId === element._id 
                                                        })?.data.reduce((prev, curr)=> {
                                                            return prev + curr.stock
                                                        },0)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {this.state.stockLib.find((lib)=> {
                                                            return lib.surplusId === element._id
                                                        })?.data.length}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {moment(element.createdAt).format("ll")}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {moment(element.updatedAt).format("ll")}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton 
                                                            onClick={()=>this.handleViewFarm(element._id)}
                                                            aria-label="delete"
                                                        >
                                                            <VisibilityOutlinedIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );        
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card.Body>
                </Card>
            </React.Fragment>   
            
        )
    }
}

export default SurplusWidget;