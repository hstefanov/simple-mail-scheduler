import React, {useState, useEffect} from "react"
import cronstrue from 'cronstrue'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Minutes from '../minutes/Minutes'
import DisplayCard from '../card/DisplayCard'
import Typography from '@material-ui/core/Typography'
const tabs = ['Minutes']

const useStyles = makeStyles(theme => ({
    displayCard: {
        marginTop: '20px'
    },
    root:{
        width:"450px",
        marginTop:"150px",
        marginLeft:"600px"

    }
}))

const CronJob = (props) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [value, setValue] = useState(['0', '0', '00', '1/1', '*', '?', '*'])
    const [selectedTabValue, setSelectedTabValue] = useState(0)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!props.value || props.value.split(' ').length !== 7) {
            setValue(['0', '0', '00', '1/1', '*', '?', '*'])
            setSelectedTab(tabs[0])
            setSelectedTabValue(0)

            parentChange(value)
        } else {
            setValue(props.value.replace(/,/g, '!').split(' '))
        }
        
        let val = value;
        if ((val[1].search('/') !== -1) && (val[2] === '*') && (val[3] === '1/1')) {
            setSelectedTab(tabs[0])
            setSelectedTabValue(0)
        } else if ((val[3] === '1/1')) {
            setSelectedTab(tabs[1])
            setSelectedTabValue(1)
        } else if ((val[3].search('/') !== -1) || (val[5] === 'MON-FRI')) {
            setSelectedTab(tabs[2])
            setSelectedTabValue(2)
        } else if (val[3] === '?') {
            setSelectedTab(tabs[3])
            setSelectedTabValue(3)
        } else if (val[3].startsWith('L') || val[4] === '1/1') {
            setSelectedTab(tabs[4])
            setSelectedTabValue(4)
        } else {
            setSelectedTab(tabs[0])
            setSelectedTabValue(0)
        }
    }, [])

    const defaultValue = (tab) => {
        switch (tab) {
            case tabs[0]:
                return ['0', '0/1', '*', '*', '*', '?', '*']
            case tabs[1]:
                return ['0', '0', '00', '1/1', '*', '?', '*']
            case tabs[2]:
                return ['0', '0', '00', '1/1', '*', '?', '*']
            case tabs[3]:
                return ['0', '0', '00', '?', '*', '*', '*']
            case tabs[4]:
                return ['0', '0', '00', '1', '1/1', '?', '*']
            case tabs[5]:
                return ['0', '0', '00', '1', '1/1', '?', '*']
            default:
                return
        }
    }

    const tabChanged = ({ tab, index }) => {
        setSelectedTab(tab)
        setSelectedTabValue(index)
        setValue(defaultValue(tab))
        parentChange(defaultValue(tab))
    }

    const getHeaders = () => {
        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            }
        }

        return (
            <>
                <AppBar position="static">
                    <Tabs value={selectedTabValue} aria-label="simple tabs example">
                        {tabs.map((tab, index) =>
                            <Tab key={index} label={tab} {...a11yProps(index)} onClick={() => tabChanged({ tab, index })} />
                        )}
                    </Tabs>
                </AppBar>
            </>
        )
    }
    
    const onValueChange = (val) => {
        console.log('val', val)
        if (val && val.length) {
            setValue(val)
        } else {
            setValue(['0', '0', '00', '1/1', '*', '?', '*'])
            val = ['0', '0', '00', '1/1', '*', '?', '*'];
        }
        parentChange(val)
    }

    const parentChange = (val) => {
        let newVal = ''
        newVal = val.toString().replace(/,/g, ' ')
        newVal = newVal.replace(/!/g, ',')
        console.log('newVal', newVal);
        props.onChange(newVal)
    }

    const getMessage = () => {
        return message;
    }

    const getRecipient = () => {
        return email;
    }

    const getFrom = () => {
        return name;
    }

    const getVal = () => {
        let val = cronstrue.toString(value.toString().replace(/,/g, ' ').replace(/!/g, ','))
        if (val.search('undefined') === -1) {
            return val;
        }
        return '-'
    }

    const getComponent = (tab) => {
        switch (tab) {
            case tabs[0]:
                return <Minutes value={value} onChange={onValueChange} />
            default:
                return
        }
    }

    const classes = useStyles()

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <div>
                        {getHeaders()}
                    </div>
                    <div className="">{getComponent(selectedTab)}</div>
                </Grid>
            </Grid>
            <div class={classes.root}>
        <Typography variant='h3'>Send mail</Typography>
        <br />
        <br />
        <br />
        <form noValidate=''>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid container item>
              <TextField
                require={true}
                id='name'
                label='Name'
                variant='outlined'
                autoComplete='new-name'
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <br />
            <br />
            <Grid container item>
              <TextField
                required
                id='email'
                label='Email'
                variant='outlined'
                autoComplete='new-email'
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <br />
            <br />
            <Grid container item>
              <TextField
                required
                id='message'
                label='Message'
                fullWidth
                multiline
                rows={4}
                value={message}
                variant='outlined'
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <br />
            <br />
            <br />
            <br />
          </Grid>
        </form>
      </div>
            {(props.showResultText || props.showResultCron) &&
                <Grid container justify="center" className={classes.displayCard}>
                    <Grid item xs={8} sm={7} lg={4}>
                        <DisplayCard
                            textResult={props.showResultText && getVal()}
                            cronResult={props.showResultCron && value.toString().replace(/,/g, ' ').replace(/!/g, ',')}
                            from={getFrom()}
                            to = {getRecipient()}
                            message = {getMessage()}
                        />
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default CronJob