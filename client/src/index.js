
import React from "react"
import ReactDom from "react-dom"
import App from "./components/App"
import { ThemeProvider } from '@material-ui/core/styles'
import  CssBaseline from '@material-ui/core/CssBaseline'
import theme from './muiTheme'

ReactDom.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App />
    </ThemeProvider>
    , document.getElementById('app')
)