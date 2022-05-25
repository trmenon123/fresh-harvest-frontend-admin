import React, { Component } from "react";
import ReactFrappeChart from "react-frappe-charts";

// Material UI imports
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { lightBlue } from '@mui/material/colors';

// Services import
import { getSurplusStatistics} from '../../../../services';

class HomeWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: {
            labels: ["12am-3am", "3am-6pm", "6am-9am", "9am-12am","12pm-3pm", "3pm-6pm", "6pm-9pm", "9am-12am"],
            datasets: [
                {
                    name: "Some Data", type: "bar",
                    values: [25, 40, 30, 35, 8, 52, 17, -4]
                },
            ]
          }
        };
    }

    componentDidMount() {
        console.log("Home Widget mounted");
        this.populateStatistics();
    }

    componentDidUpdate() {
        // console.log("Home Widget updated");
        // console.log(this.state);
    }

    populateStatistics= ()=> {
        try{
            getSurplusStatistics().subscribe({
                next: (response)=> {
                    if(response?.success === true) {
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                labels: response.data.map((element)=> {
                                    return element?.surplusName
                                }),
                                datasets:[
                                    {values: response.data.map((element)=> {
                                            return element?.count
                                        })  
                                    }
                                ] 
                            }
                        });
                    }
                },
                error: (error)=> {
                    console.log("[API ERROR] Trying to populate surplus statistics");
                    console.log(error);
                },
            })
        }catch(err) {
            console.log("[ERROR] Trying to get surplus statistics");
            console.log(err);
        }
    }

    render() {
        return(
            <React.Fragment>
                <Paper elevation= {8} sx={{my: 2, p: 4, width: '100%'}}>
                    <Stack direction="row" spacing={2}>
                        <Avatar sx={{ bgcolor: lightBlue[900], p:4 }}>
                            <KeyOutlinedIcon />
                        </Avatar>
                        <Typography 
                            variant="h6" 
                            gutterBottom 
                            component="div"
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width:'auto'}}
                        >
                            Admin Dashboard
                        </Typography>                        
                    </Stack>
                    <Divider variant='inset'/>
                </Paper>
                
                <Box sx={{width: '100%', mt: 8}}>
                    <Typography 
                        variant="subtitle2" 
                        gutterBottom 
                        component="div"
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', my: 2}}
                    >
                        Surplus farming Statistics
                    </Typography>
                    <Divider/>
                    <ReactFrappeChart
                        type="pie"
                        colors={["#1485db"]}
                        axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                        height={320}
                        data={this.state.data}
                        // data={{
                        //     labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        //     datasets: [{ values: [18, 40, 30, 35, 8, 52, 17, 4] }],
                        // }}
                    />
                </Box>
            </React.Fragment>   
            
        )
    }
}

export default HomeWidget;