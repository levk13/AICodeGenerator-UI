import axios from "axios";

export default axios.create({
  //baseURL: "http://aicodegenerator-dev.eba-b3dnfxyh.us-east-2.elasticbeanstalk.com/api"
  baseURL: "http://127.0.0.1:5000/api"
});

  