import axios from 'axios'

export function request(config){
        const instance = axios.create({
            baseURL:'http://152.136.185.210:8000/api/w6',
            timeout:5000
        })

        //axios拦截器
        instance.interceptors.request.use(config=>{
          console.log(config)
          return config //用完要还回去
        },err=>{
          console.log(err)
        })

        //响应拦截
        instance.interceptors.response.use(res=>{
          //响应成功
          console.log(res);
          return res.data;
        },err=>{
          //响应失败
          console.log(err)
        })

        return instance(config)
}