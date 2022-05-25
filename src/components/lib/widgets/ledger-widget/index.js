import React, { Component} from "react";
import {Card} from 'react-bootstrap';
import moment from "moment";

// Material UI imports
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { lightBlue } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Services Import
import { getAllTransactions } from '../../../../services';

class LedgerWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:{count:0, data:[]}, 
            modal: {open: false, data: {}},
            filters: {
                active: false,
                name: '',
                status: false,
                isCompleted: false
            }
        };
    }

    componentDidMount() {
        this.populateTransaction();
    }

    componentDidUpdate() {
        console.log("Ledger Widget updated");
        console.log(this.state);
    }

    populateTransaction = ()=> {
        const data = this.createTransactionRequestData();
        console.log(data);
        getAllTransactions(data).subscribe({
            next: (response)=> {
                if(response.success === true) {
                    this.setState({
                        ...this.state,
                        tableData: response.data
                    });
                }
            },
            error: (error)=> {
                console.log("[ERROR] api: trying to fetch transactions");
                console.log(error);
            },
        })
    }

    createTransactionRequestData = ()=> {        
        let data = {
            filterStatus: false,
            filterByUser: "",
            statusRequested: false,
            isCompleted: false
        }
        if(this.state.filters.active === true) {
            data = {...data, filterStatus: true};

            if(this.state.filters.name.length > 0) {
                data = {...data, filterByUser: this.state.filters.name}
            }
            if(this.state.filters.status === true) {
                data = {
                    ...data,
                    statusRequested: true,
                    isCompleted: this.state.filters.isCompleted
                };
            }            
        }

        return data;
    }

    handleView = (id)=> {
        try {
            const transaction = this.state.tableData.data.find((element)=> {
                return element._id === id;
            });
            this.setState({
                ...this.state,
                modal: {
                    ...this.state.modal,
                    open: true,
                    data: transaction
                }
            });
        }catch(err) {
            console.log("[ERROR] Trying to populate transaction details on to the modal");
            console.log(err);
        }
    }

    handleCloseModal = ()=> {
        this.setState({
            ...this.state,
            modal: {
                ...this.state.modal,
                open: false,
                data: {}
            }
        })
    }

    handleSelectTransactionType= (event)=> {
        console.log(event.target.value);
        const status = parseInt(event.target.value) === 0? false: true;
        const isCompleted = parseInt(event.target.value) === 1? false: true;
        try{
            this.setState({
                ...this.state,
                filters: {
                    ...this.state.filters,
                    active: true,
                    status: status,
                    isCompleted: isCompleted
                }
            });
        }catch(err) {
            console.log("[ERROR] Unable to select transaction type");
            console.log(err);
        }
    }

    handleResetFilter = ()=> {
        this.setState({
            ...this.state,
            filters: {
                ...this.state.filters,
                active: false,
                name: '',
                status: false,
                isCompleted: false
            }
        }, ()=> {
            this.populateTransaction();
        })
        
    }

    render() {
        return(            
            <React.Fragment>
                {/* View Modal */}
                <Dialog
                    open={this.state.modal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'left'}}
                    keepMounted
                    scroll="paper"
                    fullWidth
                    onClose={this.handleCloseModal}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>
                        <Grid container spacing={0}>     
                            <Grid 
                                item xs={8}
                                sx={{alignItems: 'center', justifyContent: 'flex-start'}}
                            >                                           
                                <Typography>
                                    {this.state.modal.open === false?
                                        "No Transaction Selected"
                                        :
                                        this.state.modal.data.user.name
                                    }
                                </Typography>
                            </Grid>
                            <Grid 
                                item xs={4}
                                sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
                            >  
                                <Chip 
                                    label={this.state.modal.open === false?
                                        "NOTHING"
                                        : 
                                        this.state.modal.data.completed === true? 
                                            moment(
                                                this.state.modal.data.completed.updatedAt
                                            ).format("ll")
                                            : 
                                            "Pending"
                                    }
                                    icon={<DeliveryDiningIcon />}
                                    variant="outlined"
                                    color="secondary" 
                                    size='small'
                                />
                                <Chip 
                                    label={this.state.modal.open === false?
                                        0
                                        : 
                                        this.state.modal.data?.orders.reduce((prev, curr)=> {
                                            return prev + curr?.cart.reduce((p, c)=> {
                                                return p + c?.itemCost
                                            }, 0)
                                        }, 0)
                                    }
                                    icon={<CurrencyRupeeIcon />}
                                    variant="outlined"
                                    color="primary" 
                                    size='small'
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{width: 'auto', mt: 4}}>
                            {this.state.modal.open === false?
                                <Typography>Nothing to show</Typography>
                                :
                                <Stack direction="column" spacing={0}>
                                    <Typography variant='caption'>
                                        {this.state.modal.data?.address?.addressLine1}
                                    </Typography>
                                    <Typography variant='caption'>
                                        {this.state.modal.data?.address?.addressLine2}
                                    </Typography>
                                    <Typography variant='caption'>
                                        {this.state.modal.data?.address?.city}, 
                                        {this.state.modal.data?.address?.state},
                                        {this.state.modal.data?.address?.pincode}
                                    </Typography>
                                </Stack>
                            }
                        </Box>
                    </DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <TableContainer component={Paper}>
                            <Table 
                                sx={{ width: '100%' }} 
                                size="small" 
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Item</TableCell>
                                        <TableCell align="left">Farm</TableCell>
                                        <TableCell align="left">Rate</TableCell>
                                        <TableCell align="left">Quantity</TableCell>
                                        <TableCell align="left">Price</TableCell>
                                        <TableCell align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.modal.open === false?
                                        <TableRow
                                            key='NOITEMINTABLE'
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell colSpan={6}>
                                                <Alert 
                                                    variant="outlined" 
                                                    severity="warning"
                                                    sx={{ width: '100%' }}
                                                >
                                                    No Data Available
                                                </Alert>
                                            </TableCell>                                            
                                        </TableRow>
                                        :
                                        this.state.modal?.data?.orders.map((order)=> {
                                            return order?.cart.map((cart)=> {
                                                return (
                                                    <TableRow
                                                        key={cart._id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left">
                                                            {cart?.stock?.surplusId?.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {order?.farmId?.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {cart?.stock?.unitPrice}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {cart?.quantity}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {cart?.itemCost}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {order?.delivered === true? 
                                                                "Delivered": "Pending"
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>                        
                    </DialogContent>
                </Dialog>


                <Card className="mt-4 mx-2">
                    <Card.Body> 
                        <Grid container spacing={4} sx={{my: 1, p: 2}}>
                            <Grid 
                                item 
                                xs={12} sm={12} md={4} lg={4}
                            >
                                <TextField 
                                    id="filter-name"
                                    label="filter by name"
                                    color="secondary"
                                    sx={{ width: '100%',color: 'secondary.main' }}
                                    helperText="Type Full name" 
                                    onChange={(event)=> {
                                        this.setState({
                                            ...this.state,
                                            filters: {
                                                ...this.state.filters,
                                                active: event.target.value.length === 0? false: true,
                                                name: event.target.value
                                            }
                                        })
                                    }}
                                />
                            </Grid>
                            <Grid 
                                item 
                                xs={12} sm={12} md={8} lg={4}
                            >
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={this.state.filters.status === false?
                                        0
                                        :
                                        this.state.filters.isCompleted === false? 1: 2
                                    }
                                    onChange={(event)=> this.handleSelectTransactionType(event)}
                                >
                                    <FormControlLabel 
                                        value={0} 
                                        control={<Radio color="secondary"/>} 
                                        label="All" 
                                    />
                                    <FormControlLabel 
                                        value={1} 
                                        control={<Radio color="secondary"/>} 
                                        label="Pending" 
                                    />
                                    <FormControlLabel 
                                        value={2}
                                        control={<Radio color="secondary"/>} 
                                        label="Completed" 
                                    />                                        
                                </RadioGroup>
                            </Grid>
                            <Grid 
                                item 
                                xs={12} sm={12} md={12} lg={4}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Button
                                    color="secondary"
                                    variant="outlined" 
                                    startIcon={<SearchIcon />}
                                    onClick={this.populateTransaction}
                                    sx={{m: 1}}
                                >
                                    Filter
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="outlined" 
                                    startIcon={<RestartAltIcon />}
                                    onClick={this.handleResetFilter}
                                    sx={{m: 1}}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </Card.Body>
                </Card>

                <Card className="mt-4 mx-2 mb-4">
                    <Card.Body>
                        <TableContainer component={Paper}>
                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell align="left">Consumer</TableCell>
                                        <TableCell align="left">Farms</TableCell>
                                        <TableCell align="left">Items</TableCell>
                                        <TableCell align="left">Amount</TableCell>
                                        <TableCell align="left">Status</TableCell>
                                        <TableCell align="left">Ordered</TableCell>
                                        <TableCell align="left">Delivered</TableCell>
                                        <TableCell align="left">View</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.tableData.count === 0?
                                        <TableRow
                                            key='NODATAINTABLE'
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell colSpan={8}>
                                                <Alert 
                                                    variant="outlined" 
                                                    severity="warning"
                                                    sx={{ width: '100%' }}
                                                >
                                                    No Data Available
                                                </Alert>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        this.state.tableData.data.map((element)=> {
                                            return (
                                                <TableRow
                                                    key={element._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left">
                                                        <Stack direction="row" spacing={1}>
                                                            <Avatar sx={{ bgcolor: lightBlue[600] }}>
                                                                {element?.user?.name[0]}
                                                            </Avatar>
                                                            <Typography sx={{display: 'flex', alignItems: 'center'}}>
                                                                {element?.user?.name.toUpperCase()}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element?.orders.length}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element?.orders.reduce((prev, curr)=> {
                                                            return prev + curr?.cart.length
                                                        }, 0)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element?.orders.reduce((prev, curr)=> {
                                                            return prev + curr?.cart.reduce((p, c)=> {
                                                                return p + c?.itemCost
                                                            }, 0)
                                                        }, 0)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element?.completed === true? "Completed": "Pending"}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {moment(element.createdAt).format("ll")}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element?.completed === true? 
                                                            moment(element.updatedAt).format("ll")
                                                            :
                                                            'To be updated'
                                                        }
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton 
                                                            onClick={()=>this.handleView(element._id)}
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

export default LedgerWidget;