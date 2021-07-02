import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function DisplayCard(props) {
    const classes = useStyles();

    const handleOnClick = (from, to, message, cronExpression) => {
        const url = 'http://127.0.0.1:4000/api/schedule';
    
        const data = { 
            job : {
                type : "sendMail",
                status: "Scheduled",
                from: from,
                to : to,
                message : message,
                executeAt: `${cronExpression}`
            }
        }

        axios.post(url, data)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    return (
        <Card className={classes.card}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        Execute At:
                    </Typography>
                    {props.textResult && <Typography variant="subtitle1" color="textSecondary">
                        {props.textResult}
                    </Typography>}
                    {props.cronResult && <Typography variant="subtitle1" color="textSecondary">
                        Cron: {props.cronResult}
                    </Typography>}
                    <Button  onClick={() => { handleOnClick(props.from, props.to, props.message, props.cronResult) }} variant="contained" color="primary">
                        Send Mail
                    </Button>
                </CardContent>
            </div>
        </Card>
    );
}