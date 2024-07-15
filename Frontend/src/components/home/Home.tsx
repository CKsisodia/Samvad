import { Box, Grid, Paper } from '@mui/material'
import React from 'react'
import SideBar from './SideBar'
import Chats from './Chats'

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, p:4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{height:'630px'}}>
           <SideBar />
        </Paper>
        
        </Grid>
        <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{height:'630px'}}>
           <Chats />
        </Paper>
        
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home