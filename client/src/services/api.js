import axios from 'axios';

const scheduleMail = (from, to, message, cronExpression) => {
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
};
  
export default scheduleMail;