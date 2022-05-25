import React, {useState} from "react";
import moment from "moment";
import config from '../../../../constants/config.json';
import { Form} from 'react-bootstrap';
import PropTypes from 'prop-types';

// Material UI imports
import Paper from '@mui/material/Paper';
import { styled } from '@mui/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import Typography from '@mui/material/Typography';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { deepPurple } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';


// Prelims
const CustomBox = styled(Box)({
    background: 'inherit',
    border: 1,
    boxShadow: '0 3px 5px 2px rgb(217 227 233 / 30%)',
    height: 'calc(100vh - 80px)',
    paddingTop: '20px',
    marginTop: 5,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ChatApplet = (props)=> {
  const [state, setState]= useState({
      messages: {count: 2, data: []},
      selectedService: 1,
      selectedChat: {},
      mail: {to: "", cc:"", subject: "", message: ""},
      panelOpen: false,
      modalOpen: false,
  })

  const togglePanel = ()=> {
    if( state.panelOpen === false) {
      handlePanelOpen();
    }else {
      handlePanelClose();
    }
  }

  const handlePanelOpen = () => {
    setState({...state, panelOpen: true});
  };

  const handlePanelClose = () => {
    setState({...state, panelOpen: false});
  };

  const handleServiceSelection = (key)=> {
    console.log("TODO Business Logic to update mails");
    setState({...state, selectedService: key});
  }

  const handleModalClose = () => {
    setState({...state, selectedChat: {}, modalOpen: false});
  };

  const handleMessageSelection = (item)=> { 
    setState({...state, selectedChat: item, modalOpen: true});
  }

  const handleMailCache = (type, value)=> {
    let mail = state.mail;
    mail[`${type}`] = value;
    setState({...state, mail: mail});
  }

  const handleSendMail = ()=> {
    const data = state.mail;
    console.log("TODO api call to post message with data:");
    console.log(data);
  }

  return (
    <React.Fragment>
      <Dialog
        open={state.modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleModalClose}
        aria-describedby="alert-dialog-slide-description"
        scroll= 'paper'
      >
        <DialogTitle sx={{borderBottom: '1px solid #efe3e3'}}>
          <List sx={{ width: '100%'}}>
            <ListItem 
              key="selectedMessage" 
              sx={{width: '100%'}}
            >              
              <ListItemText                 
                primary={
                  <Stack sx={{border: '1px solid whitesmoke', marginBottom: 2, padding: 2, borderRadius: 5}}>
                    <Box>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" gutterBottom>From</Typography>
                        <Typography variant="h6" gutterBottom>
                          {state.selectedChat.hasOwnProperty('from')?
                            <Chip 
                              avatar={
                                <Avatar>
                                  {state.selectedChat.from.length === 0?
                                    "No User": state.selectedChat.from[0]
                                  }
                                </Avatar>
                              } 
                              label={state.selectedChat.from}
                              color="secondary"
                            />
                            :""
                          }
                        </Typography>
                      </Stack>
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" gutterBottom>To</Typography>
                        <Typography variant="h6" gutterBottom>
                          {state.selectedChat.hasOwnProperty('to')?
                            <Chip 
                              avatar={
                                <Avatar>
                                  {state.selectedChat.to.length === 0?
                                    "No User": state.selectedChat.to[0]
                                  }
                                </Avatar>
                              } 
                              label={state.selectedChat.to}
                              sx={{marginLeft: 2}}
                              color="primary"
                            />
                            :""
                          }
                        </Typography>
                      </Stack>
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" gutterBottom>cc</Typography>
                        <Typography variant="h6" gutterBottom>
                          {state.selectedChat.hasOwnProperty('cc')?
                            <Chip 
                              avatar={
                                <Avatar>
                                  {state.selectedChat.cc.length === 0?
                                     "!": state.selectedChat.cc[0]
                                  }
                                </Avatar>
                              } 
                              label={
                                state.selectedChat.cc.length === 0?
                                "No User": state.selectedChat.cc
                              }
                              sx= {{marginLeft: 2}}
                              color="info"
                            />
                            :""
                          }
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                }
                secondary={
                  state.selectedChat.hasOwnProperty('subject')?
                    state.selectedChat.subject : "Message Subject"
                }                             
              />
              <Chip 
                label={
                  state.selectedChat.hasOwnProperty('createdAt')?
                    moment(state.selectedChat.createdAt).format('ll'): "Message date"
                }
                sx={{position: 'relative', bottom: 100, left: 35}} 
              />
            </ListItem>
          </List>
        </DialogTitle>
        <DialogContent sx={{marginTop: 5}}>
          <DialogContentText id="alert-dialog-slide-description">
            {state.selectedChat.hasOwnProperty('body')?
              state.selectedChat.body : "Message Content"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>CLOSE</Button>
        </DialogActions>        
      </Dialog>
        <CustomBox>
          <Paper 
            variant="outlined" 
            square 
            sx={{
              height: '100%', 
              marginRight: {xs: 0, md: 5, lg: 20}, 
              marginLeft: {xs: 0, md: 5, lg: 20},
            }}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={1}
              sx={{ display: {xs: 'flex', sm: 'flex', md: 'none', lg: 'none'}, backgroundColor: '#f3f3f3'}}
            >
              {config.serviceDictionary.messages.services.map((element)=> {
                return (
                  <Tooltip TransitionComponent={Zoom} title={element.display}>                    
                    <IconButton 
                      aria-label={element.name} 
                      sx={{
                        borderRadius: 0, 
                        borderBottom: state.selectedService === element.id? 5:0,
                        borderColor: 'secondary'
                      }}
                      onClick = {()=> {handleServiceSelection(element.id)}}
                    >
                      {element.id === 1?
                        <MailOutlinedIcon />: element.id === 2?
                          <ForwardToInboxOutlinedIcon />: element.id === 3?
                            <NotificationImportantOutlinedIcon />: element.id === 4?
                              <AddCircleOutlineOutlinedIcon />: ""
                      }
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Stack>

            <Stack
              direction="row"
              spacing={0}
              sx={{height: 'inherit', width: 'inherit'}}
            >
              
                <List 
                  sx={{ 
                    display: {xs: 'none', sm: 'none', md: 'block', lg: 'block'},
                    height: '100%', 
                    backgroundColor: '#f3f3f3',                    
                  }}
                >
                    <ListItem 
                      disablePadding 
                      key = "toggleButton"
                      sx={{
                        marginBottom: 2,
                        display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
                        flexDirection: state.panelOpen === true?'row-reverse': 'row',
                      }} 
                    >
                      <ListItemAvatar>
                        <Tooltip 
                          TransitionComponent={Zoom} 
                          placement="top" 
                          title={state.panelOpen === false? "Expand": "Minimize"}
                        >                          
                          <IconButton 
                            aria-label={"toggleButton"} 
                            onClick = {togglePanel}
                          >
                            {state.panelOpen === false? <FormatAlignLeftIcon/>: <FormatAlignRightIcon/>}
                          </IconButton>
                        </Tooltip>
                      </ListItemAvatar>
                    </ListItem>
                  {config.serviceDictionary.messages.services.map((element)=> {
                    return (
                      <ListItem 
                        disablePadding 
                        key = {element.id}
                        sx={{
                          borderRadius: 0, 
                          borderRight: state.selectedService === element.id? 5:0,
                          borderColor: 'secondary',
                          marginBottom: 2,
                          transition: '0.5'
                        }} 
                      >
                        <ListItemButton onClick = {()=> {handleServiceSelection(element.id)}}>
                          <ListItemAvatar>
                            <Tooltip 
                              TransitionComponent={Zoom} 
                              placement="left" 
                              title={element.display}
                            >
                              <IconButton aria-label={element.name}>
                                {element.id === 1?
                                  <MailOutlinedIcon />: element.id === 2?
                                    <ForwardToInboxOutlinedIcon />: element.id === 3?
                                      <NotificationImportantOutlinedIcon />: element.id === 4?
                                        <AddCircleOutlineOutlinedIcon />: ""
                                } 
                              </IconButton>
                            </Tooltip>
                          </ListItemAvatar>
                          {state.panelOpen === true? 
                            <ListItemText 
                              primary={element.name.toUpperCase()}
                              primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: '#858383'
                              }}
                              sx={{display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}}} 
                            /> 
                            :""
                          }
                        </ListItemButton>                        
                      </ListItem>                      
                    );
                  })}
                </List>
              
              <Card 
                container 
                sx={{
                  width: '100%', 
                  border: 2, 
                  marginLeft: 5, 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '0.5em'
                  },
                  '&::-webkit-scrollbar-track': {
                    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    outline: '1px solid slategrey'
                  }
                  }}
                >
                <Box sx={{padding: 2, display: 'flex', flexDirection: 'row'}}>
                <Badge 
                  color="secondary" 
                  badgeContent={12}
                >
                  <Chip 
                    sx={{padding: '2 0'}}
                    avatar={
                      <Avatar>
                        {state.selectedService === 1?
                          <MailOutlinedIcon />: state.selectedService === 2?
                            <ForwardToInboxOutlinedIcon />: state.selectedService === 3?
                              <NotificationImportantOutlinedIcon />: state.selectedService === 4?
                                <AddCircleOutlineOutlinedIcon />: ""
                        }
                      </Avatar>
                    } 
                    label={config.serviceDictionary.messages.services.find((element)=> element.id === state.selectedService).display.toUpperCase()}
                  />
                </Badge>
                </Box>             
                <Divider light />
                {state.selectedService === 4?
                  <Card sx={{height: 'inherit', width: 'inherit'}}>
                    <Form>
                      <Grid container spacing={2} sx={{width: 'inherit', px:2}}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Autocomplete
                            options={props.recepient}
                            id="select-on-focus"
                            selectOnFocus
                            fullWidth
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField {...params} label="To Recepient" variant="standard" />
                            )}
                            onChange={(event, value)=> handleMailCache("to", value.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Autocomplete
                            options={props.recepient}
                            id="select-on-focus"
                            selectOnFocus
                            fullWidth
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                            <TextField {...params} label="Assign CC" variant="standard" />
                            )}
                            onChange={(event, value)=> handleMailCache("cc", value.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <TextField 
                            id="standard-basic" 
                            label="Subject" 
                            variant="standard"
                            fullWidth 
                            onChange={(e)=> handleMailCache("subject", e.target.value)}
                          />  
                        </Grid>                        
                      </Grid>                 
                      
                      <Divider light sx={{my: 2}}/>
                      <Box sx={{p: 2, mb: 1, overflow: 'auto'}}>
                        <TextField
                          id="outlined-multiline-static"
                          variant="outlined"
                          label="Message"
                          multiline
                          rows={10}
                          fullWidth
                          onChange={(e)=> handleMailCache("message", e.target.value)}
                        />
                      </Box>
                      <Fab 
                        variant="extended" 
                        color="info" 
                        sx={{mb:2}}
                        onClick={handleSendMail}
                      >
                        <SendIcon sx={{ mr: 1 }} />
                        Send Mail
                      </Fab>
                    </Form>
                  </Card>
                  :
                  <Box sx={{ margin: 2, display: 'flex' }}>
                    {state.messages.count === 0? 
                      <Alert 
                          variant="outlined" 
                          severity="warning"
                          sx={{ width: '100%' }}
                      >
                          No Data Available
                      </Alert>
                      :
                      <List sx={{ width: '100%'}}>
                        {config.testDataMessages.map((element)=> {
                          return (
                            <React.Fragment>
                            <ListItem 
                              key={element.id} 
                              sx={{width: '100%', cursor: 'pointer', }}
                              onClick = {()=> handleMessageSelection(element)}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: deepPurple[900]}}>{element.from[0].toUpperCase()}</Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={element.from.toUpperCase()} 
                                secondary={element.subject}                                
                              />
                              <ListItemAvatar sx={{display: {xs:'none', sm: 'none', md: 'flex', lg: 'flex'},}}>
                                <Chip label={moment(element.createdAt).format("ll")} />
                              </ListItemAvatar>                              
                            </ListItem>
                            <Divider light />
                            </React.Fragment>
                          )
                        })}
                      </List>
                    }
                  </Box>
                }                
              </Card>
            </Stack>

          </Paper>
        </CustomBox>
    </React.Fragment>   
  );
}

ChatApplet.propTypes= {
  recepient: PropTypes.array.isRequired,
}

ChatApplet.defaultProps = {
  recepient: [],
}

export default ChatApplet;