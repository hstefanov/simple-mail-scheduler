import React, { useState } from "react"
import CronJob from "../cronjob/CronJob"

const HomePage = () => {
    const [value, setValue] = useState()

    return (
        <div>
            <h1>React simple email scheduling service.</h1>
            <CronJob
                    onChange={(e) => { setValue(e); console.log(e) }}
                    value={value}
                    showResultText={true}
                    showResultCron={true}
            />
        </div>
    )
}

export default HomePage