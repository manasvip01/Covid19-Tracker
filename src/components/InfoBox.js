import React from 'react'
import '../App.css'
import {Card,CardContent,Typography} from '@material-ui/core'

export default function InfoBox({title,cases,total}){
    return (
        <>
        <Card className='InfoBox'>
            <CardContent>
                <Typography className='info_title' color="textSecondary">{title}</Typography>
                <h2 className='info_cases'>{cases}</h2>
                <Typography className='info_total' color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
        </>
    )
}

